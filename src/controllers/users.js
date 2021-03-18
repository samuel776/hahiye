import User from '../services/userServices';
import UserProfile from '../models/UserProfile';
import authHelpers from '../utils/auth';
import mailHelpers from '../utils/mail';
import respond from '../utils/respond';
import asyncHandler from '../middlewares/async';
import UserModel from '../models/User';
import jwt from 'jsonwebtoken';
import _lodash from 'lodash';

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
        user_profile: userProfile.profile_id
      });

      mailHelpers.requestEmailConfirm(user);

      return respond.success(res, 201, user, 'Please verify your email');
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
        return res
          .status(401)
          .send({ error: 'Please verify your email first' });

      if (!(await user.matchPasswords(user_password)))
        return res.status(401).send({ error: 'Invalid credentials' });

      const user_location = await this.Utils.Location.findLocation(req);

      const token = authHelpers.signToken({
        id: user.id,
        name: user.name,
        email: user.email
      });

      const loggedUser = await User.update(
        { user_email },
        { user_active: true, user_location }
      );

      return respond.success(
        res,
        200,
        { token, loggedUser },
        'User logged in successful'
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
        return respond.error(res, 409, 'User already verified!');

      await User.update({ user_email }, { user_verified: true });

      return respond.success(res, 200, {}, 'User verified! You can now login.');
    });
  }

  forgotPassword = asyncHandler(async (req, res) => {
    const { user_email } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email doesn't exists." });
    }
    const token = jwt.sign(
      { user_id: user.user_id, user_email: user.user_email },
      process.env.RESET_PASSWORD_KEY,
      {
        expiresIn: '20m'
      }
    );

    // const data = {
    //   to: user_email,
    //   subject: 'Reset password - Hahiye 🔥',
    //   from: '"noreply@hahiye.com"<noreply@hahiye.com>',
    //   html: `
    //   <h2>Please click on the given link to reset your Password</h2>
    //   <p>${process.env.BASE_URL}/api/users/resetPassword/${token}</p>
    //   `
    // };

    const updatedUser = await UserModel.updateOne(
      { user_email },
      { resetLink: token }
    );
    if (!updatedUser)
      return res.status(500).send({ error: 'something went wrong' });

    mailHelpers.resetPasswordEmail({ user_email, user_name: user_name, token });

    return res.json({
      message:
        'Email has been sent, kindly follow the instructions to reset your password'
    });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { newPass } = req.body;
    const { resetLink } = req.params;
    const user = await User.findOne({ resetLink });
    if (!user)
      return res
        .status(400)
        .send({ error: "User with this token doesn't exists." });

    const { user_email } = jwt.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY
    );
    const password = await authHelpers.encryptPassword(newPass);
    const updatedUser = await UserModel.findOneAndUpdate(
      { user_email },
      { user_password: password, resetLink: null },
      { new: true }
    );
    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'something went wrong while updating user' });
    return res.status(200).send({
      message: 'your password has been changed successfully',
      updatedUser
    });
  });
}
export default UserControllers;
