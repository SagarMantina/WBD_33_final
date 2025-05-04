
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build

FROM node:18

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/build /app/build

EXPOSE 5000

CMD ["serve", "-s", "build", "-l", "3000"]
