// import UserModel from "../models/User";
import User from "../services/userServices";
import UserProfile from "../models/UserProfile";
import authHelpers from "../utils/auth";
import mailHelpers from "../utils/mail";
import respond from "../utils/respond";
import asyncHandler from "../middlewares/async";

class UserControllers {
  constructor(Utils) {
    this.Utils = Utils;
  }

  signup = asyncHandler(async (req, res) => {
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

  logout = asyncHandler(async (req, res) => {
    const foundUser = await User.findOne({ _id: req.params.user_id });

    if (!foundUser.user_active)
      return respond.error(res, 409, "Cannot logout more than once");

    const newUser = await User.update(
      { _id: req.params.user_id },
      { user_active: false }
    );

    return respond.success(
      res,
      200,
      { newUser },
      "User logged out successfully!"
    );
  });

  login = asyncHandler(async (req, res) => {
    const { user_email, user_password } = req.body;

    const user = await User.findOriginalOne({ user_email });

    if (!user.user_verified)
      return respond.error(res, 401, "Please verify your email first!");

    if (user.user_active)
      return respond.error(res, 403, "Cannot login more than once");

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

  verify = asyncHandler(async (req, res) => {
    const { user_email } = authHelpers.verifyToken(req.params.token);
    const user = await User.findOne({ user_email });
    if (user.user_verified)
      return respond.error(res, 409, "User already verified!");

    await User.update({ user_email }, { user_verified: true });

    return respond.success(res, 200, {}, "User verified! You can now login.");
  });
}

export default UserControllers;
