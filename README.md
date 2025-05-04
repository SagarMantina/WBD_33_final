# P2P Digital Games Marketplace

A full-stack **MERN (MongoDB, Express, React, Node.js)** application for buying and selling digital games

## 🔥 Features

- Modern React SPA for frontend
- Express.js API backend with Swagger documentation
- Redis integration for caching
- Apache Solr for fast search indexing
- Jest-based unit/integration testing
- Dockerized development environment
- Fully documented API (Swagger)

---

## 📁 Project Structure

P2P/

├── frontend/         # React app 

├── backend/          # Express app with Swagger, Redis, Solr

├── docker-compose.yml

└── README.md


---

## 🧱 Build Instructions

### 🖥️ Frontend (React)

```bash
cd frontend
npm install
npm run build
npm start       # Runs using serve on port 3000

```
## Dockerfile (Frontend)

```bash
# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM node:18
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build /app/build
EXPOSE 5000
CMD ["serve", "-s", "build", "-l", "3000"]
```

Docker Build (Frontend)
```bash
docker build -t wbd_frontend ./frontend
```

Backend (Express with Redis, Solr, Swagger)
```bash
cd backend
npm install
node app.js      # Runs on port 5000
```

Dockerfile (Backend)

```bash
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```
Docker Build (Backend)

```bash
docker build -t wbd_backend ./backend
```

🧪 Running Tests

 Frontend (Jest + React Testing Library)

 ```bash
cd frontend
npm test                # Run all tests
npm run test:coverage   # Generate coverage report
```


Coverage report will be available at:


```bash
frontend/coverage/lcov-report/index.html
```


Backend (Jest)


```bash
cd backend
npm test                # Run all tests
npm run test:coverage   # Generate coverage report
```

Coverage report will be available at:

```bash
backend/coverage/lcov-report/index.html
```

🐳 Docker Compose Setup

docker-compose.yml
```bash
version: "3.9"
services:
  backend:
    build:
      context: ./backend
    image: wbd_backend
    ports:
      - "5000:5000"
    environment:
      - REDIS_URL=redis://redis:6379
      - SOLR_URL=http://solr:8983/solr
    depends_on:
      - redis
      - solr
    networks:
      - wbdnet

  frontend:
    build:
      context: ./frontend
    image: wbd_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - wbdnet

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - wbdnet

  solr:
    image: solr
    ports:
      - "8983:8983"
    command:
      - solr-precreate
      - mycore
    networks:
      - wbdnet

networks:
  wbdnet:
```


▶️ Run Everything with Docker Compose
```bash
docker-compose up --build
```


Access URLs
Frontend 
```bash
http://localhost:5000
```
Backend 
```bash
http://localhost:3000
```
Solr Admin 
```bash
 http://localhost:8983/solr
```
Swagger Docs
```bash
http://localhost:3000/api-docs
```

API Documentation
Swagger documentation is hosted automatically when backend is running , Check for all the API's and how they work and how each output comes:

```bash
http://localhost:5000/api-docs
```

 License
MIT © 2025 — P2P Digital Games Marketplace Team



