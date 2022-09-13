require("dotenv").config();
const dogapi = require("dogapi");

const options = {
  api_key: process.env.DATADOG_API_KEY,
  app_key: process.env.DATADOG_APP_KEY,
};
dogapi.initialize(options);

const increment = (metric, value = 1) => {
  console.log(`[DATADOG] ${metric} ${value}`);
  dogapi.metric.send(metric, value, { type: "count" }, function (err, res) {
    if (err) {
      console.error(err);
    }
  });
};

module.exports = {
  increment,
};
