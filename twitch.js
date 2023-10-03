require("dotenv").config();
const axios = require("axios");
const cache = require("node-cache");

const get_app_access_token = async () => {
  const key = "twapi:twitch_app_access_token";
  const myCache = new cache();
  const token = myCache.get(key);
  if (token) {
    return token;
  }

  const url = "https://id.twitch.tv/oauth2/token";
  const data = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: "client_credentials",
  };
  try {
    const res = await axios.post(url, data);
    console.log(res);
    myCache.set(key, res.data.access_token, 3600);
    return res.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

const get_stream = async (channel) => {
  const token = await get_app_access_token();
  const url = `https://api.twitch.tv/helix/streams?user_login=${channel}`;
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(url, { headers: headers });
    console.log(res.data.data[0]);
    return res.data.data[0];
  } catch (error) {
    console.log(error);
  }
};

const get_user = async (channel) => {
  const token = await get_app_access_token();
  const url = `https://api.twitch.tv/helix/users?login=${channel}`;
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(url, { headers: headers });
    return res.data.data[0];
  } catch (error) {
    console.log(error);
  }
};

const get_user_by_id = async (id) => {
  const token = await get_app_access_token();
  const url = `https://api.twitch.tv/helix/users?id=${id}`;
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(url, { headers: headers });
    return res.data.data[0];
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  get_app_access_token,
  get_stream,
  get_user,
  get_user_by_id,
};
