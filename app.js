// get dotenv
require("dotenv").config();
const express = require("express");
const {
  create_eventsub,
  get_eventsub,
  delete_eventsub,
} = require("./eventsub");
const { get_app_access_token } = require("./twitch");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/wizard", async (req, res) => {
  // show wizard.html
  res.sendFile(__dirname + "/wizard.html");
});

app.get("/eventsub", async (req, res) => {
  res.send(await get_eventsub());
});

app.post("/eventsub/:id", async (req, res) => {
  res.send(await create_eventsub(req.params.id));
});

app.delete("/eventsub/:id", async (req, res) => {
  res.send(await delete_eventsub(req.params.id));
});

app.get("/eventsub/callback", async (req, res) => {
  const data = req.body || {};
  console.log(data);

  // if header have 'Twitch-Eventsub-Message-Type', then return data.challenge
  if (req.headers["twitch-eventsub-message-type"]) {
    res.send(data.challenge);
  } else {
    res.send(data);
  }
});

app.post("/eventsub/callback", async (req, res) => {
  console.log("is post");
  const data = req.body || {};
  console.log(data);

  // if header have 'Twitch-Eventsub-Message-Type', then return data.challenge
  if (req.headers["Twitch-Eventsub-Message-Type"] || req.body?.challenge) {
    res.send(data.challenge);
  } else {
    res.send(data);
  }
});

app.get("/token", async (req, res) => {
  const result = await get_app_access_token();
  res.send(result);
});

app.listen(4200, () => {
  console.log("Example app listening on port 4200!");
});
