import mongoose from 'mongoose'
const { Schema } = mongoose;

const user_videoSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
}, { timestamps: true, versionKey: false });

export default mongoose.model('User_video', user_videoSchema);