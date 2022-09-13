require("dotenv").config();
const axios = require("axios");

const send = async (to, message) => {
  const apiKey = process.env.TMI_API_KEY;
  const url = `https://leaven-tmi.haenu.xyz/${apiKey}/send/${to}`;
  const apiSecret = process.env.TMI_API_SECRET;
  const headers = {
    "Content-Type": "application/json",
    "X-API-Secret": apiSecret,
  };
  const data = {
    to,
    message,
  };
  try {
    const res = await axios.post(url, data, { headers: headers });
    console.log("[TMI] SUCCESS");
    return res;
  } catch (error) {
    console.error("[TMI] ", error);
  }
};

const sendLegacy = async (to, message) => {
  // urlencode message
  message = encodeURIComponent(message);
  const url = `https://leaven-tmi.haenu.xyz/send?to=${to}&message=${message}`;
  try {
    const res = await axios.get(url);
    console.log("[TMI] SUCCESS");
    return res;
  } catch (error) {
    console.error("[TMI] ", error);
  }
};

module.exports = {
  send,
  sendLegacy,
};
