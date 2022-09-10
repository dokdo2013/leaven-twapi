// get dotenv
require("dotenv").config();
const crypto = require("crypto");
const express = require("express");
const TES = require("tesjs");
const {
  create_eventsub,
  get_eventsub,
  delete_eventsub,
} = require("./eventsub");
const { get_app_access_token } = require("./twitch");

const app = express();

// Notification request headers
const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  "Twitch-Eventsub-Message-Signature".toLowerCase();
const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
const MESSAGE_TYPE_NOTIFICATION = "notification";
const MESSAGE_TYPE_REVOCATION = "revocation";

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = "sha256=";

app.use(
  express.raw({
    // Need raw message body for signature verification
    type: "application/json",
  })
);

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
  tes
    .subscribe("stream.online", {
      broadcaster_user_id: "188643459",
    })
    .then((_) => {
      console.log("Subscription successful");
      res.send("Subscription successful");
    })
    .catch((err) => {
      console.log("Subscription failed: " + err);
      // console.log(err);
    });
  // res.send(await create_eventsub(req.params.id));
});

app.delete("/eventsub/:id", async (req, res) => {
  res.send(await delete_eventsub(req.params.id));
});

// app.post("/eventsub/callback", async (req, res) => {
//   let secret = process.env.TWITCH_WEBHOOK_SECRET;
//   let message = getHmacMessage(req);
//   let hmac = HMAC_PREFIX + getHmac(secret, message); // Signature to compare

//   if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
//     console.log("signatures match");

//     // Get JSON object from body, so you can process the message.
//     let notification = JSON.parse(req.body);

//     if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
//       // TODO: Do something with the event's data.

//       console.log(`Event type: ${notification.subscription.type}`);
//       console.log(JSON.stringify(notification.event, null, 4));

//       res.sendStatus(204);
//     } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
//       res.status(200).send(notification.challenge);
//     } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
//       res.sendStatus(204);

//       console.log(`${notification.subscription.type} notifications revoked!`);
//       console.log(`reason: ${notification.subscription.status}`);
//       console.log(
//         `condition: ${JSON.stringify(
//           notification.subscription.condition,
//           null,
//           4
//         )}`
//       );
//     } else {
//       res.sendStatus(204);
//       console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
//     }
//   } else {
//     console.log("403"); // Signatures didn't match.
//     res.sendStatus(403);
//   }
// });

app.get("/token", async (req, res) => {
  const result = await get_app_access_token();
  res.send(result);
});

app.listen(4200, () => {
  console.log("Example app listening on port 4200!");
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
