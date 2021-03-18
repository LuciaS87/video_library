import { Video } from "../models/video.model.js"
// TODO - move to template_data.json
const defaultVideos = [{
    url: "https://www.youtube.com/watch?v=QFvk5vxbXzM",
    title: "Kotlin reklama",
    description: "super reklama, musisz zobaczyć",
    tags: "#ketchup#pizza#frytki#hot-dog",
    contactEmail: "s.f@gmail.com"
}, {
    url: "https://www.youtube.com/watch?v=qOk12DHPWMY",
    title: "Dlaczego kawa w biurze jest za darmo?",
    description: "Jeśli nigdy się nad tym nie zastanawiałeś, to zacznij",
    tags: "#kawa#praca#przerwa",
    contactEmail: "k.r@gmail.com"
}, {
    url: "https://www.youtube.com/watch?v=gdOfDaX1BbU",
    title: "JavaScript Promise #5/7 - Async / Await",
    description: "Chcesz zawsze pozostać na bieżąco z programowaniem? Słowa kluczowe async / await ułatwiają pracę z obietnicami",
    tags: "#JavaScript#async/await#nauka#wiedza#moc",
    contactEmail: "m.p@gmail.comcom"
}, {
    url: "https://www.youtube.com/watch?v=A9JDTH6PPB8",
    title: "Pan Jabłko i Pan Gruszka",
    description: "Piosenka o owocach",
    tags: "#dzieci#jabłko#gruszka#pietruszka",
    contactEmail: "l.t@gmail.com"
}, {
    url: "https://www.youtube.com/watch?v=QOSoCmcR0Ms",
    title: "Nie bój się chcieć",
    description: "Piosenka z filmu ZWIERZOGRÓD",
    tags: "#dzieci#dorośli#królik#marzenia",
    contactEmail: "l.t@gmail.com"
}, ]


const initializedVideos = async function(req, res) {
    for (let video of defaultVideos) {
        addVideoToDataBase(video);
    }
    res.send("video initialized");
}


const searchVideo = async function(req, res) {
    let random = req.query.random;
    let tags = req.query.tags;
    let videos;
    if (random)
        videos = await getRandomVideos();

    if (tags) {
        tags = tags.split(",");
        videos = await getVideosByTags(tags);
    };
    res.json(videos);
}
async function getRandomVideos() {
    try {
        const videos = await Video.find({ archived: false });
        let tmp = [];
        for (let i = 0; i < 5; i++) {
            let rand = Math.floor(Math.random() * videos.length);
            tmp.push(...videos.splice(rand, 1));
        }
        return tmp;

    } catch (e) {
        //TODO return response with 404 code
        console.error(e.message);
    }
};
async function getVideosByTags(tags) {
    tags = tags.map(tag => new RegExp(`#${tag}`, 'i'));
    try {
        const videos = await Video.find({ tags: { $in: tags }, archived: false });
        return videos;

    } catch (e) {
        //TODO return response with 404 code
        console.error(e.message);
    }
};

const addVideo = async function(req, res) {
    const video = req.body;
    if (!video) return res.sendStatus(409);
    try {
        let videoDB = await addVideoToDataBase(video);
        if (!isVideoValid(video)) {
            throw new Error("Video is not valid!");
        }
        res.json(videoDB);
    } catch (e) {
        res.sendStatus(400);
    }
}

const updateVideo = async function(req, res) {
    const video = req.body;
    let videoDB;
    try {
        videoDB = await Video.updateOne({ _id: video._id }, video);
        videoDB = await Video.findOne({ _id: video._id });
    } catch (e) {
        console.error(e);
        res.send(e);
        return;
    }
    res.json(videoDB);
}

async function addVideoToDataBase(video) {
    // TODO create specific middleware for validation
    // TODO to return array consisting of object keys, just wrote Object.keys(video) => ['url', 'title']
    if (!isVideoValid(video)) {
        return new Error("Video is not valid!")
    }
    const videodb = new Video(video)
    return await videodb.save();
}

function isVideoValid(video) {
    const reqFields = ["url", "title", "description"];
    const videoFields = Object.keys(video)
    for (let field of reqFields) {
        if (!videoFields.includes(field)) {
            return false;
        }
    }
    return true;
};

export default {
    initializedVideos,
    searchVideo,
    addVideo,
    updateVideo
}