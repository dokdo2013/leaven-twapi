const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getInfo = async (id) => {
  const sql =
    "SELECT p.idx as idx, p.name as name, eventsub_type, eventsub_id, eventsub_condition, \
      action_cafe, ac.name as cafe_name, ac.club_id as cafe_club_id, ac.menu_id as cafe_menu_id, ac.title_format as cafe_title_format, ac.message_format as cafe_message_format, \
      action_slack, as.name as slack_name, as.slack_link as slack_link, as.message_format as slack_message_format, \
      action_tmi, at.name as tmi_name, at.message_format as tmi_message_format \
    FROM pipeline p \
      LEFT JOIN action_cafe ac ON p.action_cafe = ac.idx \
      LEFT JOIN action_slack `as` ON p.action_slack = `as`.idx \
      LEFT JOIN action_tmi `at` ON p.action_tmi = `at`.idx \
    WHERE eventsub_id = ?";
  const values = [id];
  const result = await query(sql, values);
  if (result.length === 0) {
    return {
      isUserExist: false,
    };
  }
  const pipeline = result[0];
  const action = {
    isUserExist: true,
    info: {
      idx: pipeline.idx,
      name: pipeline.name,
      eventsub_type: pipeline.eventsub_type,
      eventsub_id: pipeline.eventsub_id,
      eventsub_condition: pipeline.eventsub_condition,
    },
    action: {
      cafe: {
        enabled: pipeline.action_cafe !== null,
        club_id: pipeline.cafe_club_id,
        menu_id: pipeline.cafe_menu_id,
        titleFormat: pipeline.cafe_title_format,
        messageFormat: pipeline.cafe_message_format,
      },
      slack: {
        enabled: pipeline.action_slack !== null,
        link: pipeline.slack_link,
        messageFormat: pipeline.slack_message_format,
      },
      tmi: {
        enabled: pipeline.action_tmi !== null,
        messageFormat: pipeline.tmi_message_format,
      },
    },
  };
  return action;
};

module.exports = {
  query,
  getInfo,
};
