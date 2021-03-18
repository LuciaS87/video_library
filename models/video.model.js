import mongoose from 'mongoose'
const { Schema } = mongoose;

const videoSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: String,
    uploadedBy: String,
    contactEmail: String,
    archived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });
const Video = mongoose.model('Video', videoSchema);
export {
    Video
}