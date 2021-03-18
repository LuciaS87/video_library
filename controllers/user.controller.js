import User from "../models/user.model.js"
import bcrypt from "bcrypt"

const initliaizedUsers = function(req, res) {
    for (let user of defaultUsers) {
        addUserToDataBase(user, res);
    }
    res.send("users initialized");
}

const registerUser = async function(req, res) {
    const user = req.body;
    res.json(await addUserToDataBase(user, res));
}

async function addUserToDataBase(user, res) {
    try {
        if (await User.findOne({ email: user.email })) {
            throw new Error("User exist in database");
        }

        if (!isUserValid(user)) {
            throw new Error("User is not valid!");
        }
        user.password = await hashPassword(user.password);
        const userdb = new User(user);
        const userResp = await userdb.save();
        return {
            id: userResp._id,
            email: userResp.email
        };
    } catch (e) {
        return res.sendStatus(409);
    }
}

const hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);;
}

const comparePassword = async function(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

function isUserValid(user) {
    const reqFields = ["firstName", "username", "lastName", "email", "password"];
    const userFields = Object.keys(user)
    for (let field of reqFields) {
        if (!userFields.includes(field)) {
            return false;
        }
    }
    return true;
};

// TODO - move to template_data.json
const defaultUsers = [{
    firstName: "Janusz",
    lastName: "Nowak",
    username: "JN",
    age: "35",
    email: "j.n@gmail.com",
    password: "1234"
}, {
    firstName: "Agata",
    lastName: "Nowak",
    username: "AN",
    age: "32",
    email: "a.n@gmail.com",
    password: "12345"
}, {
    firstName: "Szymus",
    lastName: "Filar",
    username: "SF",
    age: "26",
    email: "s.f@gmail.com",
    password: "kotlin"
}, {
    firstName: "Klaudia",
    lastName: "Rydzanicz",
    username: "KR",
    age: "30",
    email: "k.r@gmail.com",
    password: "klamka"
}, {
    firstName: "Mikolaj",
    lastName: "Porada",
    username: "MP",
    age: "20",
    email: "m.p@gmail.com",
    password: "spioch"
}, {
    firstName: "Lucyna",
    lastName: "Tupaj",
    username: "LT",
    age: "30",
    email: "l.t@gmail.com",
    password: "bazyl"
}, ];

export default {
    initliaizedUsers,
    registerUser,
    hashPassword,
    comparePassword
}