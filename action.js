require("dotenv").config();
const slack = require("./util/slack");
const datadog = require("./util/datadog");
const tmi = require("./util/tmi");
const db = require("./util/db");
const substitute = require("./util/substitute");

const online = async (event, subscription, isTriggered = false) => {
  console.log(`Stream is online: ${event.broadcaster_user_name}`);

  // datadog metric increase
  datadog.increment("twapi.stream.online");

  // action 범위 설정
  const { isUserExist, action } = await db.getInfo(
    subscription.id,
    "stream.online"
  );

  if (!isUserExist) {
    datadog.increment("twapi.error.user_not_exist");
    return;
  }

  // 네이버 카페 글 작성
  // if (action.cafe?.enabled) {
  //   const { club_id, menu_id, titleFormat, messageFormat } = action.cafe;
  //   const title = await substitute.replace(titleFormat, event, isTriggered);
  //   const message = await substitute.replace(messageFormat, event, isTriggered);
  //   await cafe.write(club_id, menu_id, title, message);
  //   datadog.increment("twapi.action.cafe");
  // }

  // 슬랙 알림 발송
  if (action.slack?.enabled) {
    const { link, messageFormat } = action.slack;
    const message = await substitute.replace(messageFormat, event, isTriggered);
    await slack.send(link, message);
    datadog.increment("twapi.action.slack");
  }

  // 트위치 tmi 메시지 발송
  if (action.tmi?.enabled) {
    const { messageFormat } = action.tmi;
    const message = await substitute.replace(messageFormat, event, isTriggered);
    await tmi.sendLegacy(event.broadcaster_user_login, message);
    datadog.increment("twapi.action.tmi");
  }
};

const offline = async (event, subscription) => {
  console.log(`Stream is offline: ${event.broadcaster_user_name}`);

  // datadog metric increase
  datadog.increment("twapi.stream.offline");

  // action 범위 설정
  const { isUserExist, action } = await db.getInfo(
    subscription.id,
    "stream.offline"
  );

  if (!isUserExist) {
    datadog.increment("twapi.error.user_not_exist");
    return;
  }

  // 네이버 카페 글 작성
  // if (action.cafe?.enabled) {
  //   const { club_id, menu_id, titleFormat, messageFormat } = action.cafe;
  //   const title = await substitute.replace(titleFormat, event);
  //   const message = await substitute.replace(messageFormat, event);
  //   await cafe.write(club_id, menu_id, title, message);
  //   datadog.increment("twapi.action.cafe");
  // }

  // 슬랙 알림 발송
  if (action.slack?.enabled) {
    const { link, messageFormat } = action.slack;
    const message = await substitute.replace(messageFormat, event);
    await slack.send(link, message);
    datadog.increment("twapi.action.slack");
  }

  // 트위치 tmi 메시지 발송
  if (action.tmi?.enabled) {
    const { messageFormat } = action.tmi;
    const message = await substitute.replace(messageFormat, event);
    await tmi.sendLegacy(event.broadcaster_user_login, message);
    datadog.increment("twapi.action.tmi");
  }
};

module.exports = {
  online,
  offline,
};
