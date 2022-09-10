require("dotenv").config();
const axios = require("axios");
const qs = require("qs");
const { get_app_access_token } = require("./twitch");

// create twitch eventsub subscription
const create_eventsub = async (type, user_id) => {
  const token = await get_app_access_token();
  const url = "https://api.twitch.tv/helix/eventsub/subscriptions";
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };
  const body = {
    type: type,
    version: "1",
    condition: {
      broadcaster_user_id: user_id,
    },
    transport: {
      method: "webhook",
      callback: "https://twapi.haenu.com/teswh/event",
      secret: "secret123456",
    },
  };
  try {
    const res = await axios.post(url, body, { headers: headers });
    console.log("[CREATE] ", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// get twitch eventsub subscriptions
const get_eventsub = async () => {
  const token = await get_app_access_token();
  const url = "https://api.twitch.tv/helix/eventsub/subscriptions";
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
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
  const token = await get_app_access_token();
  const baseUrl = `https://api.twitch.tv/helix/eventsub/subscriptions`;
  const query = {
    id,
  };
  const url = `${baseUrl}?${qs.stringify(query)}`;
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.delete(url, { headers: headers });
    console.log("[DELETE] ", res.data);
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
