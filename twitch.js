require("dotenv").config();
const axios = require("axios");

const get_app_access_token = async () => {
  const url = "https://id.twitch.tv/oauth2/token";
  const data = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: "client_credentials",
  };
  try {
    const res = await axios.post(url, data);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  get_app_access_token,
};
