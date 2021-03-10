import {Schema, model, Types} from 'mongoose';

const UserTypeSchema = new Schema(
    {
        user_type_id: {
            type: Schema.Types.ObjectId,
            unique: true,
            default: new Types.ObjectId()
        },
        user_type_name:{
            type:String,
            unique: true,
            required: true
        },
        user_password: {
            type:String,
            required: true,
        },
        user_name:{
            type:String,
            required: true
        },
        user_type: {
            type:String,
        },
        user_role:{
            type:String,
        },
        user_privilege: {
            type:String,
        },
        user_profile:{
            type:String,
        },
        user_auth_provider: {
            type:String,
        },
        user_country:{
            type:String,
        },
        user_gender: {
            type:String,
        },
        user_location:{
            type:String,
        },
        user_verified: {
            type:String,
        },
        user_active:{
            type:String,
        },

    },
    { timestamps: true }
)

export default model('UserType', UserTypeSchema);