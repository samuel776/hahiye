import {Schema, model} from 'mongoose';

const BlogSchema = new Schema(
    {
        title:{
            type:String,
            unique: [true, 'Please provide another title'],
            required: [true,  "Please provide a blog sender's title"]
        },
        body: {
            type:String,
            required: [true, 'Please provide a blog body'],
        }

    },
    { timestamps: true }
)

export default model('Blog', BlogSchema);