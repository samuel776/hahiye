import express from 'express';
import { User } from '../controllers';
import usersValidator from '../validation/users';

const router = express.Router();

router.post('/login', usersValidator.validateLogin, User.login);
router.post('/signup', usersValidator.validateSignup, User.signup);
router.get('/verify/:token', usersValidator.validateConfirm, User.verify);
router.put('/forgotPassword', User.forgotPassword);
router.put(
  '/resetPassword/:resetLink',
  usersValidator.validatePassword,
  User.resetPassword
);

export default router;
