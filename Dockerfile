FROM oven/bun

EXPOSE 5173/tcp

WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]
