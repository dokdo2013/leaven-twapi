// get dotenv
require("dotenv").config();
const { default: axios } = require("axios");
const cors = require("cors");
const express = require("express");
const TES = require("tesjs");
const {
  create_eventsub,
  get_eventsub,
  delete_eventsub,
} = require("./eventsub");
const action = require("./action");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const db = require("./util/db");
const cafe = require("./util/cafe");

const app = express();
app.use(cors());
app.use(express.static("./wizard/build"));

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get("/", function rootHandler(req, res) {
  res.send("Hello World!");
});

app.use(Sentry.Handlers.errorHandler());

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

app.get("/test", async (req, res) => {
  const data = await db.getInfo("fad085e7-54ce-4262-aae6-375c379e3cc9");
  res.send(data);
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

tes.on("stream.online", (event, subscription) => {
  action.online(event, subscription);
});

tes.on("stream.offline", (event, subscription) => {
  action.offline(event, subscription);
});
