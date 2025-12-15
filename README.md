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