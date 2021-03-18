/* eslint-disable class-methods-use-this */
import Joi from 'joi';
import respond from '../utils/respond';
import asyncHandler from '../middlewares/async';

class UsersValidator {
  constructor() {
    this.validateSignup = asyncHandler(async (req, res, next) => {
      const schema = Joi.object({
        user_name: Joi.string().min(5).required(),
        age: Joi.number().min(12).allow(null),
        user_email: Joi.string().email().required(),
        user_password: Joi.string()
          .min(6)
          .max(20)
          .required()
          .pattern(/^[a-zA-Z\d\s.!@#$%&*()_+-=:?]{6,}$/, 'password'),
        confirm_password: Joi.string()
          .valid(Joi.ref('user_password'))
          .required()
      });
      const { error } = schema.validate(req.body);
      if (error)
        return respond.error(
          res,
          400,
          error.details[0].message.split('"').join('')
        );
      return next();
    });

    this.validateLogin = asyncHandler(async (req, res, next) => {
      const schema = Joi.object({
        user_email: Joi.string().email().required(),
        user_password: Joi.string().min(6).max(20).required()
      });
      const { error } = schema.validate(req.body);
      if (error)
        return respond.error(
          res,
          400,
          error.details[0].message.split('"').join('')
        );
      return next();
    });

    this.validateConfirm = asyncHandler(async (req, res, next) => {
      const schema = Joi.object({
        token: Joi.string().min(10).required()
      });
      const { error } = schema.validate(req.params);
      if (error) return respond.error(res, 403, 'Invalid URL!');
      return next();
    });
    this.validatePassword = asyncHandler(async (req, res, next) => {
      const schema = Joi.object({
        newPass: Joi.string()
          .min(6)
          .max(20)
          .required()
          .pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
      });
      const { error } = schema.validate(req.body);
      if (error)
        return respond.error(
          res,
          400,
          error.details[0].message.split('"').join('')
        );
      return next();
    });
  }
}

const usersValidator = new UsersValidator();

export default usersValidator;
