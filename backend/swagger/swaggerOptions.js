const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'P2P Digital Games Marketplace API',
      version: '1.0.0',
      description: 'REST API documentation for your MERN digital games marketplace app',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        url: 'https://p2p-final-backend.onrender.com/'
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
