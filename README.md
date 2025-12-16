# Node tutrial

- TypeScript
- framework: express
- orm: prisma

# 再ビルド
docker compose up --build

docker compose down
# 常駐
docker compose up -d

docker compose exec api sh -lc 'rm -rf prisma/migrations/*'


## package.jsonのライブラリをインストール
``
$ npm install
```

## prismaインストール
```
$ npm install prisma @prisma/client
$ npx prisma init
```

### Prisma 7 は「adapter か accelerateUrl」が必須
```
$ npm i @prisma/client
$ npm i -D prisma
$ npm i @prisma/adapter-pg pg
```