FROM node:20-alpine

WORKDIR /app

# openssl は Prisma が必要とすることが多い
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
