/**
 * 
 * API REST SERVER
 * 
 */

// Dependencies
const http = require( 'http' );
const url =  require( 'url' );
const StringDecoder = require( 'string_decoder' ).StringDecoder;
const handlers = require( '../routes/handlers' );
const router = require( '../routes/router' );
const util = require( 'util' );
const debug = util.debuglog( 'server' );
const utils = require( '../lib/utils' );

const httpPort = 3200;

// Starting HTTP server
const startingServer = ( req, res ) => {
    // Get the URL and parse it
    const parsedUrl = url.parse( req.url, true );

    // Get the path
    const path = parsedUrl.pathname;
    const trimedPath = path.replace( /^\/+|\/+$/g, '' );

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get HTTP method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload
    const decoder = new StringDecoder( 'utf-8' );
    let buffer = '';
    req.on( 'data', ( ( data ) => {
        buffer += decoder.write( data );
    }));
    req.on( 'end', ( () => {
        buffer += decoder.end();

        // Chose the handler this request should go to
        const chosenHandler = typeof( router[trimedPath] ) !== 'undefined' ? router[ trimedPath ] : handlers.notFound;

        // Construct the data objectto send to the handler
        const data = {
            trimedPath,
            queryStringObject,
            method,
            headers,
            payload : utils.parseJsonToObject( buffer )
        };
        
        chosenHandler( data, ( statusCode, payload ) => {
            // Use the status code called back by the handler or default to 200
            statusCode = typeof( statusCode ) === 'number' ? statusCode : 200;

            // Use de payload called back by the handler or defalut to an empty object
            payload = typeof( payload ) === 'object' ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify( payload );

            // Return the response
            res.setHeader( 'Content-Type' , 'application/json' );
            res.writeHead( statusCode );
            res.end( payloadString );

            // If the response is 200 print cyan otherwise print red
            if ( statusCode === 200 || statusCode ===201 ) {
                debug( '\x1b[36m%s\x1b[0m', method.toUpperCase() + '/' + trimedPath + ' ' + statusCode );
            } else {
                debug( '\x1b[31m%s\x1b[0m', method.toUpperCase() + '/' + trimedPath + ' ' + statusCode );
            }
        } );
    } ) );
};

// Instantiate the HTTP server
const httpServer = http.createServer( ( req, res ) => {
    startingServer( req, res );
});

// Init script
const init = () => {
    // Start the HTTP server
    httpServer.listen( httpPort, ( () => {
        console.log( '\x1b[36m%s\x1b[0m', 'The server is listening on port: '+ httpPort );
    } ) );
};

// Export the module
module.exports = init;
