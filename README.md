# leaven-twapi
[기존 v1 서비스](https://github.com/dokdo2013/naver-cafe-twitch-alert)

트위치 생방송 시작, 종료 이벤트에 대해 여러가지 동작을 실행해주는 서비스

## 구조 설명
Twitch EventSub으로 `stream.online` 과 `stream.offline` 데이터를 받아서 처리

## Tech Stack
- Express.js
- MariaDB
- Redis
- Datadog
- Sentry
- External APIs (Twitch, Naver)

## Database Scheme (DDL)
### pipeline
```sql
create table pipeline
(
    idx                int auto_increment comment '파이프라인 ID'
        primary key,
    name               varchar(30)                          null comment '파이프라인 이름',
    eventsub_type      varchar(50)                          null comment '트위치 Eventsub type',
    eventsub_id        varchar(50)                          null comment '트위치 Eventsub ID',
    eventsub_condition longtext                             null comment '트위치 Eventsub Condition',
    action_cafe        int                                  null comment '네이버 카페 게시물 등록 액션',
    action_slack       int                                  null comment '슬랙 웹훅 액션',
    action_tmi         int                                  null comment '트위치 tmi 액션',
    created_at         datetime default current_timestamp() null comment '생성일시',
    updated_at         datetime default current_timestamp() null comment '수정일시'
)
    comment 'twapi 파이프라인';
```
### action_cafe
```sql
create table action_cafe
(
    idx            int auto_increment
        primary key,
    name           varchar(30)                          null comment '액션 이름',
    club_id        varchar(15)                          null comment '카페 ID',
    menu_id        varchar(15)                          null comment '게시판 ID',
    title_format   varchar(50)                          null comment '제목 형식',
    message_format longtext                             null comment '본문 형식',
    created_at     datetime default current_timestamp() null comment '생성일자',
    updated_at     datetime default current_timestamp() null comment '수정일자'
)
    comment '네이버 카페 액션';
```
### action_slack
```sql
create table action_slack
(
    idx            int auto_increment,
    name           varchar(30)                          null comment '슬랙 액션 이름',
    message_format longtext                             null comment '메세지 형식',
    slack_link     varchar(250)                         null comment '슬랙 웹훅 링크',
    created_at     datetime default current_timestamp() null comment '생성일시',
    updated_at     datetime default current_timestamp() null comment '수정일시',
    constraint action_slack_idx_uindex
        unique (idx)
)
    comment '슬랙 액션';
```
### action_tmi
```sql
create table action_tmi
(
    idx            int auto_increment
        primary key,
    name           varchar(30)                          null comment '액션 이름',
    message_format longtext                             null comment '메시지 형식',
    created_at     datetime default current_timestamp() null comment '생성일시',
    updated_at     datetime default current_timestamp() null comment '수정일시'
)
    comment 'tmi 액션';
```

## .env Structure
```txt
CLIENT_ID=  # 네이버 Open API Client ID
CLIENT_SECRET=  # 네이버 Open API Client Secret

REDIRECT_URI=  # 네이버 Open API Redirect URI
USER_CODE=  # 네이버 Open API OAuth2.0 User Code (일회용)
ACCESS_TOKEN=  # 네이버 Open API OAuth2.0 Access Token
REFRESH_TOKEN=  # 네이버 Open API OAuth2.0 Refresh Token

DB_HOSTNAME=  # DB Hostname
DB_USERNAME=  # DB Username
DB_PASSWORD=  # DB Password
DB_DATABASE=  # DB Database
DB_PORT=  # DB Port

TWITCH_CLIENT_ID=  # Twitch API Client ID
TWITCH_CLIENT_SECRET=  # Twitch API Client Secret
TWITCH_WEBHOOK_SECRET=  # Twitch EventSub Webhook Secret

DATADOG_API_KEY_ID=  # Datadog API Key ID
DATADOG_API_KEY=  # Datadog API Key

DATADOG_APP_KEY_ID=  # Datadog App Key ID
DATADOG_APP_KEY=  # Datadog App Key

TMI_API_KEY=  # leaven-tmi api key
TMI_API_SECRET=  # leaven-tmi api secret

SENTRY_DSN=  # Sentry DSN

REDIS_HOST=  # Redis Hostname
REDIS_PORT=  # Redis Port
```
