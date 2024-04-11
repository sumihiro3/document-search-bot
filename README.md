# Document search bot

## Description

ドキュメント検索 Bot は、独自データのドキュメント内容を LLM から検索できるようにした Bot アプリケーションです。
いわゆる RAG（Retrieval-Augmented Generation：検索拡張生成）モデルの Bot アプリケーションです。

## 環境構成

- ベクター化
    - OpenAI API
        - text-embedding-3-small
- ベクターデータストア
    - PostgreSQL + pg_vector + Prisma
        - ローカル
            - Docker
        - ローンチ先候補
            - Neon
            - Supabase
- LLM
    - ChatGPT
- LLM Framework
    - LangChain
- Web application Framework
    - NestJS
- 開発言語
    - TypeScript

## 開発メモ

- [NestJS + LangChain + Prisma でドキュメント検索Bot を作る](https://zenn.dev/sumihiro3/scraps/421cd55a3cbc34)

## 動作環境準備

### ライブラリのインストール

```bash
yarn install
```

### 環境変数の設定

`.env.sample` ファイルを`.env` というファイル名でコピーし、値を設定する。

- OPENAI_API_KEY
    - OpenAI API key
- TMDB_API_KEY
    - [TMDB](https://www.themoviedb.org/) API Key

### データベースの設定

Docker compose で PostgreSQL を起動する。
ベクトルデータに対応した EXtension `pg_vector` を利用する。

```sh
docker compose up -d
```

### Prisma でテーブルを作成する

```sh
# エンティティを作成
yarn prisma:generate

# データベースにテーブルを作成する
npx prisma migrate dev
```

## ベクター化するデータのダウンロードとベクター化

### Memo データ

下記コマンドでベクター化する

```sh
yarn memo:insert
```

### Movie データ

#### ダウンロード

```sh
yarn movie:download
```

#### ベクター化

```sh
yarn movie:insert
```

## アプリの起動

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## アプリの実行

### Memo の検索

ブラウザーで実行
`http://localhost:3000/memo?q=天気`

```json
[
  {
    "id": 53,
    "content": "今日の天気はどうですか？",
    "createdAt": "2024-04-09T05:20:38.175Z",
    "updatedAt": "2024-04-09T05:20:38.175Z"
  },
  {
    "id": 52,
    "content": "気分が悪い。",
    "createdAt": "2024-04-09T05:20:38.175Z",
    "updatedAt": "2024-04-09T05:20:38.175Z"
  },
  {
    "id": 316,
    "content": "雨の音は心地よく、心を落ち着かせてくれます。",
    "createdAt": "2024-04-09T05:20:38.175Z",
    "updatedAt": "2024-04-09T05:20:38.175Z"
  },
  {
    "id": 82,
    "content": "今日は天気が良いので、公園に長い散歩に行く予定です。",
    "createdAt": "2024-04-09T05:20:38.175Z",
    "updatedAt": "2024-04-09T05:20:38.175Z"
  },
  {
    "id": 236,
    "content": "今日は天気が良いので、公園に長い散歩に行く予定です。",
    "createdAt": "2024-04-09T05:20:38.175Z",
    "updatedAt": "2024-04-09T05:20:38.175Z"
  }
]
```

### Movie の検索

ブラウザーで実行
`http://localhost:3000/movies?q=ドキドキのサスペンス映画`

```json
[
  {
    "id": "782054",
    "title": "映画ドラえもん のび太の宇宙小戦争 2021",
    "overview": "夏休みのある日。のび太が拾った小さなロケットの中から、手のひらサイズの宇宙人・パピがあらわれる！彼は、宇宙のかなたにある小さな星・ピリカ星の大統領で、反乱軍から逃れるために地球にやってきたという。最初はパピのあまりの小ささに戸惑うドラえもんたちだったが、ひみつ道具“スモールライト”で自分たちも小さくなって一緒に遊ぶうち、次第に仲良なっていく。ところが、パピを追って地球にやってきたクジラ型の宇宙戦艦が、パピをとらえるためにドラえもんやのび太たちを攻撃。みんなを巻き込んでしまったことに責任を感じたパピは、ひとり反乱軍に立ち向かおうとするが･･････。  大切な友だちと、その故郷を守るため、ドラえもんたちはピリカ星へと出発する！！",
    "releaseDate": "2022-03-03T15:00:00.000Z",
    "genres": [
      "アニメーション",
      "サイエンスフィクション",
      "アドベンチャー",
      "ファミリー"
    ],
    "posterPath": "/9o1tPyB1ZgifdiMG4Pk0XpPB6hw.jpg",
    "backdropPath": "/iflKt34Ck2JpY2PY9wW1zwdJgJi.jpg",
    "popularity": 19.248,
    "voteAverage": 5.9,
    "voteCount": 105,
    "originalLanguage": "ja",
    "originalTitle": "映画ドラえもん のび太の宇宙小戦争 2021",
    "createdAt": "2024-04-10T14:18:18.941Z",
    "updatedAt": "2024-04-10T14:18:18.941Z"
  },
  {
    "id": "1004663",
    "title": "美と殺戮のすべて",
    "overview": "ヴェネツィア国際映画祭金獅子賞を皮切りに世界各国の映画賞を席巻！\r 写真家ナン・ゴールディンの光と影に肉薄するドキュメンタリー",
    "releaseDate": "2022-11-22T15:00:00.000Z",
    "genres": [
      "ドキュメンタリー"
    ],
    "posterPath": "/cvO51xxtIUHc5w5ZgFsigiFaUaO.jpg",
    "backdropPath": "/hY97iRKr2t44lbX2GHRhfK5CVC7.jpg",
    "popularity": 27.838,
    "voteAverage": 7.408,
    "voteCount": 119,
    "originalLanguage": "en",
    "originalTitle": "All the Beauty and the Bloodshed",
    "createdAt": "2024-04-10T14:18:18.932Z",
    "updatedAt": "2024-04-10T14:18:18.932Z"
  },
  {
    "id": "818502",
    "title": "ネイバー大戦争 ～隣の芝はサンバの香り～",
    "overview": "",
    "releaseDate": "2022-08-31T15:00:00.000Z",
    "genres": [
      "コメディ"
    ],
    "posterPath": "/oT7388wlquvpGN3LPxVeD849QAI.jpg",
    "backdropPath": "/iDzduWwkTICb1lAQoLMWLrySUNs.jpg",
    "popularity": 8.241,
    "voteAverage": 5.7,
    "voteCount": 57,
    "originalLanguage": "pt",
    "originalTitle": "Vizinhos",
    "createdAt": "2024-04-10T14:18:18.942Z",
    "updatedAt": "2024-04-10T14:18:18.942Z"
  },
  {
    "id": "732459",
    "title": "47RONIN -ザ・ブレイド-",
    "overview": "『47RONIN』時代から300年後の世界が舞台。2つ合わせると強大な力となる秘剣を手に入れようとする呪術師に次々とサムライが殺されるなか、剣の在りかのカギを握るルナは、理由も分からず忍者たちに襲われて……。アンナ・アカナ主演のアクション。",
    "releaseDate": "2022-10-24T15:00:00.000Z",
    "genres": [
      "ファンタジー"
    ],
    "posterPath": "/kjFDIlUCJkcpFxYKtE6OsGcAfQQ.jpg",
    "backdropPath": "/2CWJTgfU8SGRZ25hn8L6iujATvk.jpg",
    "popularity": 36.149,
    "voteAverage": 6.6,
    "voteCount": 194,
    "originalLanguage": "en",
    "originalTitle": "Blade of the 47 Ronin",
    "createdAt": "2024-04-10T14:18:18.938Z",
    "updatedAt": "2024-04-10T14:18:18.938Z"
  },
  {
    "id": "957992",
    "title": "军火大劫案",
    "overview": "",
    "releaseDate": "2022-04-08T15:00:00.000Z",
    "genres": [
      "犯罪",
      "ドラマ",
      "アクション"
    ],
    "posterPath": "/ronrzgFs2FOk0R4BAZgyLaYdhua.jpg",
    "backdropPath": "/gOkK6Y1QazWgA9Pf9ZiT3QLxRBZ.jpg",
    "popularity": 32.262,
    "voteAverage": 6.569,
    "voteCount": 51,
    "originalLanguage": "zh",
    "originalTitle": "军火大劫案",
    "createdAt": "2024-04-10T14:18:18.938Z",
    "updatedAt": "2024-04-10T14:18:18.938Z"
  }
]
```

## License

MIT license
