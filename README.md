# Watchlist

Watchlist lets you know when something changed.

# QuickStart

```
$ git clone https://github.com/jooohn/watchlist.git && cd watchlist
$ echo 'SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz'> .env
$ docker-compose build
$ docker-compose run --rm web yarn db:setup
$ docker-compose up
# Access http://[docker-machine-ip]:8080
```
