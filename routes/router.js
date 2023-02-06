/**
 * 
 * Router
 * 
 */

// Dependencies
const handlers = require( './handlers' );

// Container for the module (to be exported)
const router = {
    ping : handlers.ping,
    hello : handlers.hello,
    users : handlers.users,
    admins : handlers.admins,
    clientes : handlers.clientes,
    productos : handlers.productos,
    deliverys : handlers.deliverys,
    repartidores : handlers.repartidores,
};

// Export the module
module.exports = router;
