const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Restaurant App API',
        description: 'Automatically generated swagger doc',
    },
    host: 'localhost:5000',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../app.js']; // your main app entry file

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger JSON generated!');
    // optionally start your server here
    require('../server.js');
});