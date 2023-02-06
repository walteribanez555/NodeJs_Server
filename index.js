/**
 * 
 * Index start API
 * 
 */

// Dependencies
const server = require('./server/server');

const app = {
    init : () => {
        server();
    }
};

app.init();

