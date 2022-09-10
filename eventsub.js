require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

// create twitch eventsub subscription
const create_eventsub = async (user_id) => {
  const url = "https://api.twitch.tv/helix/eventsub/subscriptions";
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
  };
  const body = {
    type: "stream.online",
    version: "1",
    condition: {
      broadcaster_user_id: user_id,
    },
    transport: {
      method: "webhook",
      callback: "https://twapi.haenu.com/eventsub/callback",
      secret: "secret123456",
    },
  };
  try {
    const res = await axios.post(url, body, { headers: headers });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// get twitch eventsub subscriptions
const get_eventsub = async () => {
  const url = "https://api.twitch.tv/helix/eventsub/subscriptions";
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
  };
  try {
    const res = await axios.get(url, { headers: headers });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// delete twitch eventsub subscription
const delete_eventsub = async (id) => {
  const baseUrl = `https://api.twitch.tv/helix/eventsub/subscriptions`;
  const query = {
    id,
  };
  const url = `${baseUrl}?${qs.stringify(query)}`;
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
  };
  try {
    const res = await axios.delete(url, { headers: headers });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// module export
module.exports = {
  create_eventsub,
  get_eventsub,
  delete_eventsub,
};
