import User from "../services/userServices";
import UserProfile from "../models/UserProfile";
import authHelpers from "../utils/auth";
import mailHelpers from "../utils/mail";
import respond from "../utils/respond";
import asyncHandler from "../middlewares/async";

class UserControllers {
  constructor(Utils) {
    this.Utils = Utils;

    /**
     * @desc      Signup User
     * @endpoint  POST
     * @route     /api/users/signup
     * @access    Public
     */
    this.signup = asyncHandler(async (req, res) => {
      const current_location = await this.Utils.Location.findLocation(req);

      const userProfile = await UserProfile.create({});

      const user = await User.create({
        ...req.body,
        user_location: current_location,
        user_country: current_location,
        user_profile: userProfile.profile_id,
      });

      mailHelpers.requestEmailConfirm(user);

      return respond.success(res, 201, user, "Please verify your email");
    });

    /**
     * @desc Login user
     * @endpoint POST
     * @route /api/users/login
     * @access Public
     */
    this.login = asyncHandler(async (req, res) => {
      const { user_email, user_password } = req.body;
      const user = await User.findOriginalOne({ user_email });

      if (!user.user_verified)
        return respond.error(res, 401, "Please verify your email first!");

      if (!(await user.matchPasswords(user_password)))
        return respond.error(res, 401, "Invalid Credentials");

      const user_location = await this.Utils.Location.findLocation(req);

      const token = authHelpers.signToken({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      const loggedUser = await User.update(
        { user_email },
        { user_active: true, user_location }
      );

      return respond.success(
        res,
        200,
        { token, loggedUser },
        "User logged in successful"
      );
    });

    /**
     * @desc  verify user
     * @endpoint GET
     * @route /api/verify/:token
     * @access Public
     */
    this.verify = asyncHandler(async (req, res) => {
      const { user_email } = authHelpers.verifyToken(req.params.token);
      const user = await User.findOne({ user_email });
      if (user.user_verified)
        return respond.error(res, 409, "User already verified!");

      await User.update({ user_email }, { user_verified: true });

      return respond.success(res, 200, {}, "User verified! You can now login.");
    });
  }
}

export default UserControllers;
