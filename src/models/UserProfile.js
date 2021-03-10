import {Schema, model, Types} from 'mongoose';

const UserProfileSchema = new Schema(
    {
        profile_id: {
            type: Schema.Types.ObjectId,
            unique: true,
            default: new Types.ObjectId()
        },
    },
    { timestamps: true }
)

export default model('UserProfile', UserProfileSchema);