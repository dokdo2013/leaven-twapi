require("dotenv").config();
const axios = require("axios");

const send = async (link, message) => {
  // const link = process.env.SLACK_URL;
  const data = {
    text: message,
  };
  try {
    const res = await axios.post(link, data);
    console.log("[SLACK] SUCCESS");
    return res;
  } catch (error) {
    console.log("[SLACK] ", error);
  }
};

module.exports = {
  send,
};
