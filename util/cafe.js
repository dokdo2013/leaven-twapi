const axios = require("axios");
const redis = require("./redis");
const qs = require("qs");

const write = async (club_id, menu_id, title, message) => {
  // get token
  const token = await get_access_token();

  // send request
  const url = `https://openapi.naver.com/v1/cafe/${club_id}/menu/${menu_id}/articles`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    charset: "utf-8",
    Authorization: `Bearer ${token}`,
  };
  const subject = encodeURI(title);
  const content = encodeURI(message);
  const dataString = `subject=${subject}&content=${content}`;
  const data = encodeURI(dataString);
  try {
    await axios.post(url, data, { headers: headers });
    console.log("[CAFE] SUCCESS");
  } catch (error) {
    console.error(error.response.data);
  }
};

const get_access_token = async () => {
  const key = "twapi:naver_access_token";
  const token = await redis.get(key);
  if (token) {
    return token;
  } else {
    return await refresh_token();
  }
};

const refresh_token = async () => {
  const baseUrl = "https://nid.naver.com/oauth2.0/token";
  const querystring = {
    grant_type: "refresh_token",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: process.env.REFRESH_TOKEN,
  };
  const url = `${baseUrl}?${qs.stringify(querystring)}`;
  try {
    const res = await axios.get(url);
    await redis.set("twapi:naver_access_token", res.data.access_token, 3600);
    return res.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  write,
};
