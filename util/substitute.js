const { get_stream, get_user } = require("../twitch");

const replace = async (str, event, isTriggered = false) => {
  const replaceTarget = await getReplaceTarget(event, isTriggered);

  for (const [key, value] of Object.entries(replaceTarget)) {
    str = str.replaceAll(key, value);
  }

  return str;
};

const getInfo = async (event) => {
  const { broadcaster_user_login } = event;

  const stream = await get_stream(broadcaster_user_login);
  const user = await get_user(broadcaster_user_login);

  return { stream, user };
};

const getReplaceTarget = async (event, isTriggered) => {
  const { stream, user } = isTriggered ? event : await getInfo(event);

  const thumbnail_url = stream?.thumbnail_url
    .replace("{width}", "1280")
    .replace("{height}", "720");

  return {
    "{방송ID}": stream?.id || "방송ID",
    "{방송제목}": stream?.title || "방송제목",
    "{방송시작시간}": stream?.started_at || "방송시작시간",
    "{시청자수}": stream?.viewer_count || "시청자수",
    "{방송썸네일}": thumbnail_url || "방송썸네일",
    "{방송카테고리}": stream?.game_name || "방송카테고리",
    "{스트리머}": user?.display_name || "스트리머",
    "{스트리머아이디}": user?.login || "스트리머아이디",
    "{스트리머프로필}": user?.profile_image_url || "스트리머프로필",
    "{스트리머배너}": user?.offline_image_url || "스트리머배너",
  };
};

module.exports = {
  replace,
};
