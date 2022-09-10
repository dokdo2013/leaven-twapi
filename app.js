// get dotenv
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const TES = require("tesjs");
const {
  create_eventsub,
  get_eventsub,
  delete_eventsub,
} = require("./eventsub");

const app = express();

app.use(cors());
app.use(express.static("./wizard/build"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/wizard", async (req, res) => {
  res.sendFile(__dirname + "/wizard/build/index.html");
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

tes.on("stream.online", (event) => {
  console.log(`Stream is online: ${event.broadcaster_user_name}`);
});

tes.on("stream.offline", (event) => {
  console.log(`Stream is online: ${event.broadcaster_user_name}`);
});
