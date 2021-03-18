import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import jwt_decode from 'jwt-decode'
dotenv.config();

const authenticateToken = function(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
        const { exp } = jwt_decode(token);
        if (Date.now() >= exp * 1000) return res.sendStatus(403);

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    } catch (e) {
        console.error(e.message);
        res.sendStatus(401);
    }
}

export default {
    authenticateToken
}