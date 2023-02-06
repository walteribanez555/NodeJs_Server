/* eslint-disable no-console */
/**
 * 
 * DELIVERYS handler
 * 
 */

// Dependencies
const { file, ErrorFile } = require( '../lib/files' );
const utils = require( '../lib/utils' );

const deliverys = {
    options : async( data, callback ) => {
        callback( 200 );
    },
    get : async( data, callback ) => {
        const cliente = typeof( data.queryStringObject.cliente ) === 'string' && data.queryStringObject.cliente.trim().length > 0 ? data.queryStringObject.cliente.trim() : false;
        const dataExist = await file.read( { file : 'deliverys', ext : 'json' } );
        const statusCode = dataExist instanceof ErrorFile ? 500 : 200;
        const response =  dataExist instanceof ErrorFile ? { message : 'Datafile error: The file DELIVERYS could not be created' } : id ? dataExist.filter( element => element.id === id ) : dataExist;
        callback( statusCode, response );
    },
    post : async( data, callback ) => {

        const cliente = typeof( data.payload.cliente ) === 'string'  ? data.payload.cliente.trim() : false;
        const productos = typeof( data.payload.productos ) === 'string' && data.payload.productos.trim().length > 0 ? data.payload.productos.trim() : false;
        const total = typeof( data.payload.total ) === 'string' && data.payload.total.trim().length > 0 ? data.payload.total.trim() : false;
        const direccion = typeof( data.payload.direccion ) === 'string' && data.payload.direccion.trim().length > 0 ? data.payload.direccion.trim() : false;

        if ( !cliente || !productos || !total || !direccion )
            return callback( 400, { message : 'Missing required fields or not valid' } );


        const newRegister = { 
            cliente,
            productos,
            total,
            direccion,
            dateCreated : utils.dateFormat()
        };

        const dataExist = await file.read( { file : 'deliverys', ext : 'json' } );
        const newFile = dataExist instanceof ErrorFile ? await file.create( { file : 'deliverys', data : [ newRegister ], ext : 'json' } ) : dataExist.filter( element => element.cliente === cliente );
        !( dataExist instanceof ErrorFile ) && dataExist.push( newRegister );

        if ( newFile instanceof ErrorFile ) 
            return callback( 500, { message : 'The file DELIVERYS could not be created' } );

        if ( newFile.length > 0 ) 
            return callback( 406, { message : 'The register already exist' } );

        const result = newFile.length === 0 && await file.update( { file : 'deliverys', data : dataExist, ext : 'json' } );
        
        if ( newFile.length === 0 && result instanceof ErrorFile )
            return callback( 500, { message : 'The file DELIVERYS could not be updated' } );

        callback( 200, { message : 'The register was created successfully!' } );

    },
    put : async( data, callback ) => {
        const cliente = typeof( data.payload.cliente ) === 'string' && data.payload.cliente.trim().length > 0 ? data.payload.cliente.trim() : false;
        const productos = typeof( data.payload.productos ) === 'string' && data.payload.productos.trim().length > 0 ? data.payload.productos.trim() : false;
        const total = typeof( data.payload.total ) === 'string' && data.payload.total.trim().length > 0 ? data.payload.total.trim() : false;
        const direccion = typeof( data.payload.direccion ) === 'string' && data.payload.direccion.trim().length > 0 ? data.payload.direccion.trim() : false;
        if ( !cliente && !productos && !total && !direccion )
            return callback( 400, { message : 'Missing required fields or not valid' } );

        const dataExist = await file.read( { file : 'deliverys', ext : 'json' } );
        
        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file DELIVERYS does not exist' } );
        //filtra archivos por el cliente
        const updateRegister = dataExist.filter( element => element.cliente === cliente )[ 0 ];

        if ( cliente) {
            updateRegister.cliente = cliente;
        }
        if ( productos) {
            updateRegister.productos = productos;
        }
        if ( total ) {
            updateRegister.total = total;
        }
        if ( direccion ) {
            updateRegister.direccion = direccion;
        }

        const dataAvailable = dataExist.filter( element => element.cliente !== cliente );
        dataAvailable.push( updateRegister );
        const dataUpdate = await file.update( { file : 'deliverys', data : dataAvailable, ext : 'json' } );
        
        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file DELIVERYS does not exist' } );

        callback( 200, { message : 'The register was updated successfully!' } );

    },
    delete : async( data, callback ) => {
        const cliente = typeof( data.payload.cliente ) === 'string' && utils.validatecliente( data.payload.cliente.trim() ) === true ? data.payload.cliente.trim() : false;

        if ( !cliente )
            return callback( 400, { message : 'Missing the record id to update' } );

        const dataExist = await file.read( {  file : deliverys, ext : 'json' } );

        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file DELIVERYS does not exist' } );
        
        const dataAvailable = dataExist.filter( element => element.cliente !== cliente );
        const dataUpdate = await file.update( { file : 'deliverys', data : dataAvailable, ext : 'json' } );

        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file DELIVERYS does not exist' } );

        callback( 200, { message : 'The register was deleted successfully!' } );
    },
};

module.exports = deliverys;
