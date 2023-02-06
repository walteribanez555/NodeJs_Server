/**
 * 
 * Admin Handlers
 * 
 */

// Dependencies
const users = require( '../endpoints/users' );
const admins = require( '../endpoints/administrador' );
const clientes = require( '../endpoints/clientes' );
const productos = require( '../endpoints/productos' );
const deliverys = require( '../endpoints/deliverys' );
const repartidores = require( '../endpoints/repartidores' );

// Obtain handler acceptable methods for a given handler module
const obtainHandler = ( moduleHandler, acceptableMethods ) => {
    return( ( data, callback ) => {
        if ( acceptableMethods.indexOf( data.method ) > -1 ) {
            moduleHandler[ data.method ]( data, callback );
        } else {
            callback ( 405 );
        }    
    });
};

// Define the handlers
const handlers = {
    // Users
    users : obtainHandler( users, [ 'options', 'get', 'post','put','delete' ] ),
    //admins
    admins : obtainHandler( admins, [ 'options', 'get', 'post','put','delete' ] ),
    //clientes
    clientes : obtainHandler( clientes, [ 'options', 'get', 'post','put','delete' ] ),
    //productos
    productos : obtainHandler( productos, [ 'options', 'get', 'post','put','delete' ] ),
    //deliverys
    deliverys : obtainHandler( deliverys, [ 'options', 'get', 'post','put','delete' ] ),
    //repartidores
    repartidores : obtainHandler( repartidores, [ 'options', 'get', 'post','put','delete' ] ),
    // Ping handler
    ping : ( ( data, callback ) => {
        const responseMessage = {
            message : 'PONG'
        };
        callback( 200, responseMessage );
    } ),
    // Hello handler
    hello : ( ( data, callback ) => {
        const responseMessage = {
            message : 'Hi, this is the first homework'
        };
        callback( 200, responseMessage );
    } ),
    // Not found handler
    notFound : ( ( data, callback ) => { 
        const responseMessage = {
            message : 'NOT FOUND'
        };
        callback( 404, responseMessage );
    } )
};

// Export the module
module.exports = handlers;

