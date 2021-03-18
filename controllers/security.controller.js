import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import userController from "./user.controller.js"
dotenv.config();

const login = async function(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let user = await User.findOne({ email: email });
        if (user === null) return res.sendStatus(401);

        if (!await userController.comparePassword(password, user.password))
            return res.sendStatus(401);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await User.updateOne({ _id: user._id }, { refreshToken: refreshToken });
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (e) {
        console.error(e.message);
        res.sendStatus(401);
    }
}

const refresh = async function(req, res) {
    try {
        const refreshToken = req.body.token;
        if (refreshToken == null) return res.sendStatus(401);
        const user = await User.findOne({ refreshToken: refreshToken })
        if (user) {
            jwt.verify(refreshToken, process.env.TOKEN_REFRESH_SECRET, (err, user) => {
                if (err) return res.sendStatus(403);
                const accessToken = generateAccessToken(user);
                res.json({ accessToken: accessToken });
            })
        }
    } catch (e) {
        console.error(e.message);
        res.sendStatus(401);
    }
}

function generateAccessToken(user) {
    return jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '5h' });
}

function generateRefreshToken(user) {
    return jwt.sign(user.email, process.env.TOKEN_REFRESH_SECRET);
}

export default {
    login,
    refresh
}