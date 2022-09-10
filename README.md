# naver-cafe-twitch-alert
트위치 생방송을 시작하면 네이버 카페에 게시물 등록 (네이버 카페 Open API 이용)

## 파일 설명
- main.py : 메인 파일
- fetch_twitch.py : 스트리밍 중인지 확인하는 파일
- naver_token.py : 네이버 OAuth 처리하는 파일
- db.py : 데이터베이스 관련된 함수 모아둔 파일
- write.py : 네이버 카페에 게시물 작성하는 파일

## Database Scheme (DDL)
```sql
create table leaven
(
    idx                    int auto_increment comment 'idx'
        primary key,
    streamer_name          varchar(30)                      null comment '스트리머 닉네임 (name)',
    streamer_name_ko       varchar(30)                      null comment '스트리머 닉네임 (한글)',
    broadcast_status       enum ('ON', 'OFF') default 'OFF' null comment '뱅종 OFF, 뱅온 ON',
    on_broadcast_datetime  datetime                         null comment '방송 시작 일시',
    off_broadcast_datetime datetime                         null comment '방송 종료 일시',
    update_datetime        datetime                         null comment '수정 일시',
    del_stat               tinyint(1)         default 0     null comment '삭제 여부',
    del_datetime           datetime                         null comment '삭제일시'
)
    comment '레븐 네이버카페 알림';

```

```sql
create table leaven_history
(
    idx           int auto_increment comment 'idx'
        primary key,
    leaven_idx    int                                  null comment '레븐 멤버 idx',
    action_type   enum ('ON', 'OFF')                   null comment 'ON/OFF 여부',
    decision_rate int                                  null comment '결정 비율
(뱅온 : 3번의 Trial에서 1번 이상 뱅온 상태 필요, 
뱅종 : 3번의 Trial에서 3번 모두 뱅종 상태이면 변경)',
    reg_datetime  datetime default current_timestamp() null comment '등록일시',
    constraint leaven_history_leaven_idx_fk
        foreign key (leaven_idx) references leaven (idx)
)
    comment '레븐 상태변경 로그';
```

## .env Structure
```txt
CLIENT_ID=  # 네이버 Open API Client ID
CLIENT_SECRET=  # 네이버 Open API Client Secret

REDIRECT_URI=  # 네이버 Open API Redirect URI
USER_CODE=  # 네이버 Open API OAuth2.0 User Code (일회용)
ACCESS_TOKEN=  # 네이버 Open API OAuth2.0 Access Token
REFRESH_TOKEN=  # 네이버 Open API OAuth2.0 Refresh Token

CLUB_ID=  # 네이버 카페 ID
MENU_ID=  # 네이버 카페 게시판 ID

DB_HOSTNAME=  # DB Hostname
DB_USERNAME=  # DB Username
DB_PASSWORD=  # DB Password
DB_DATABASE=  # DB Database
DB_PORT=  # DB Port

SLACK_URL=  # Slack Webhook URL
```

## Cronjob
```sh
*/3 * * * * /usr/local/bin/python3.9 {DIRECTORY}/main.py
```
replace {DIRECTORY} to your project directory
