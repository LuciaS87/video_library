import User_video from "../models/user_video.model.js"
import User from "../models/user.model.js"


const addToFavorites = async function(req, res) {
    const video_id = req.params.videoId;
    const user = req.user;
    console.log(user, video_id);
    if (!video_id || !user) {
        return res.sendStatus(401)
    }
    try {
        const userDB = await User.findOne({ email: user.email })
        const user_videoObj = {
            userId: userDB._id,
            videoId: video_id
        }
        if (!await User_video.findOne(user_videoObj)) {
            const u_vDb = new User_video(user_videoObj);
            await u_vDb.save();
            return res.sendStatus(204);
        }
        throw new Error("Subscription exists")
    } catch (e) {
        return res.sendStatus(409);
    }
}

const deleteFromFavorites = async function(req, res) {
    const video_id = req.params.videoId;
    const user = req.user;
    if (!video_id || !user) {
        return res.sendStatus(401)
    }
    try {
        const userDB = await User.findOne({ email: user.email })
        const user_videoObj = {
            userId: userDB._id,
            videoId: video_id
        }
        if (await User_video.findOne(user_videoObj).remove()) {
            return res.sendStatus(204);
        }
    } catch (e) {
        return res.sendStatus(400);
    }
}

const getFavourities = async function(req, res) {
    const user = req.user;
    if (!user) {
        return res.sendStatus(401)
    }
    try {
        const userDB = await User.findOne({ email: user.email })
        const user_videoObj = {
            userId: userDB._id
        }
        const videos = await User_video.find(user_videoObj);
        return res.json(videos);
    } catch (e) {
        return res.sendStatus(409);
    }
}

export default {
    addToFavorites,
    getFavourities,
    deleteFromFavorites
};