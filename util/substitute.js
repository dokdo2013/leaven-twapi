const { get_stream, get_user } = require("../twitch");

const replace = async (str, event) => {
  const replaceTarget = await getReplaceTarget(event);

  for (const [key, value] of Object.entries(replaceTarget)) {
    str = str.replace(key, value);
  }

  return str;
};

const getInfo = async (event) => {
  const { broadcaster_user_name } = event;

  const stream = await get_stream(broadcaster_user_name);
  const user = await get_user(broadcaster_user_name);

  return { stream, user };
};

const getReplaceTarget = async (event) => {
  const { stream, user } = await getInfo(event);

  return {
    "{방송ID}": stream?.id || "방송ID",
    "{방송제목}": stream?.title || "방송제목",
    "{방송시작시간}": stream?.started_at || "방송시작시간",
    "{시청자수}": stream?.viewer_count || "시청자수",
    "{방송썸네일}": stream?.thumbnail_url || "방송썸네일",
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
