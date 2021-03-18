import { string } from 'joi';
import { Schema, model, Types } from 'mongoose';
import authHelpers from '../utils/auth';

const UserSchema = new Schema(
  {
    user_email: {
      type: String,
      unique: true,
      required: true
    },
    user_password: {
      type: String,
      required: true
    },
    user_name: {
      type: String,
      required: true
    },
    user_type: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'artist', 'manager']
    },
    user_role: {
      type: String
    },
    user_privilege: {
      type: String
    },
    user_profile: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true
    },
    user_auth_provider: {
      type: String,
      default: 'local',
      enum: ['local', 'google']
    },
    user_country: {
      type: String
    },
    user_gender: {
      type: String,
      default: null
    },
    user_location: {
      type: String
    },
    user_verified: {
      type: Boolean,
      default: false
    },
    user_active: {
      type: Boolean,
      default: false
    },
    resetLink: {
      data: String
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('user_password')) return next();
  this.user_password = await authHelpers.encryptPassword(this.user_password);
  return next();
});

UserSchema.methods.matchPasswords = async function (password) {
  const valid = await authHelpers.decryptPassword(password, this.user_password);
  return valid;
};

export default model('User', UserSchema);
