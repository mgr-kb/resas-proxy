# resas-proxy

## 概要

下記apiにアクセスするためのproxyです。
https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc

## セットアップ

※ Node v22.12.0で動作確認をしています。

```
$ pnpm install
$ pnpm run dev
```

## 利用するsecretについて

ローカルで確認する場合、`c.env.XXX`でアクセス可能なsecretについては下記の設定が必要です。

1. `.dev.vars`の作成
```
# copy file
$ cp ./.dev.vars.sample ./.dev.vars
```

2. `.dev.vars`に必要な値を設定
