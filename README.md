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

## Installation

```bash
yarn install
```

## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## License

MIT license
