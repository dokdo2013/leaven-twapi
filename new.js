/**
 * 2023년 10월부터 만들어지는 새로운 파일
 */

// get dotenv
// require("dotenv").config();

const axios = require("axios");
const cors = require("cors");
const express = require("express");
const TES = require("tesjs");
const {
  create_eventsub,
  get_eventsub,
  delete_eventsub,
} = require("./eventsub");
const action = require("./action");
const twitch = require("./twitch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("./wizard/build"));

app.get("/", function rootHandler(req, res) {
  res.send("Hello World!");
});

app.get("/wizard", async (req, res) => {
  res.sendFile(__dirname + "/wizard/build/index.html");
});

app.get("/user/name/:name", async (req, res) => {
  const { name } = req.params;
  const user = await twitch.get_user(name);
  res.send(user);
});

app.get("/user/id/:id", async (req, res) => {
  const { id } = req.params;
  const user = await twitch.get_user_by_id(id);
  res.send(user);
});

app.get("/user/name/:name/stream", async (req, res) => {
  const { name } = req.params;
  const stream = await twitch.get_stream(name);
  res.send(stream);
});

app.get("/health", function rootHandler(req, res) {
  res.send("success!");
});

app.get("/eventsub", async (req, res) => {
  res.send(await get_eventsub());
});

app.post("/eventsub/:id", async (req, res) => {
  const online = await create_eventsub("stream.online", req.params.id);
  const offline = await create_eventsub("stream.offline", req.params.id);
  res.send({ online, offline });
});

app.delete("/eventsub/:id", async (req, res) => {
  res.send(await delete_eventsub(req.params.id));
});

app.listen(4200, () => {
  console.log("twapi listening on port 4200!");
});

const tes = new TES({
  identity: {
    id: process.env.TWITCH_CLIENT_ID,
    secret: process.env.TWITCH_CLIENT_SECRET,
  },
  listener: {
    baseURL: "https://twapi.haenu.com",
    secret: process.env.TWITCH_WEBHOOK_SECRET,
    server: app,
  },
});

tes.on("stream.online", async (event, subscription) => {
  const onlineUrl = "http://archivers.app/media-api/recorder";

  const streamData = await twitch.get_stream(event.broadcaster_user_login);
  const data = {
    user_id: event.broadcaster_user_login,
    title: streamData.title,
  };

  await axios.post(onlineUrl, data).catch((err) => {
    console.error(err);
  });

  return true;
  // action.online(event, subscription);
});

tes.on("stream.offline", async (event, subscription) => {
  const offlineUrl = "http://archivers.app/media-api/recorder/end";

  await axios
    .post(offlineUrl, {
      user_id: event.broadcaster_user_login,
    })
    .catch((err) => {
      console.error(err);
    });

  return true;

  // action.offline(event, subscription);
});
