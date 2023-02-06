/* eslint-disable no-console */
/**
 * 
 * PRODUCTOS handler
 * 
 */

// Dependencies
const { file, ErrorFile } = require( '../lib/files' );
const utils = require( '../lib/utils' );

const productos = {
    options : async( data, callback ) => {
        callback( 200 );
    },
    get : async( data, callback ) => {
        const nombre = typeof( data.queryStringObject.nombre ) === 'string' && data.queryStringObject.nombre.trim().length > 0 ? data.queryStringObject.nombre.trim() : false;
        const dataExist = await file.read( { file : 'productos', ext : 'json' } );
        const statusCode = dataExist instanceof ErrorFile ? 500 : 200;
        const response =  dataExist instanceof ErrorFile ? { message : 'Datafile error: The file PRODUCTOS could not be created' } : id ? dataExist.filter( element => element.id === id ) : dataExist;
        callback( statusCode, response );
    },
    post : async( data, callback ) => {
        //estado para ver si el producto esta disponible o agotado
        const nombre = typeof( data.payload.nombre ) === 'string'  ? data.payload.nombre.trim() : false;
        const marca = typeof( data.payload.marca ) === 'string' && data.payload.marca.trim().length > 0 ? data.payload.marca.trim() : false;
        const precio = typeof( data.payload.precio ) === 'string' && data.payload.precio.trim().length > 0 ? data.payload.precio.trim() : false;
        const estado = typeof( data.payload.estado ) === 'string' && data.payload.estado.trim().length > 0 ? data.payload.estado.trim() : false;
    

        if ( !nombre || !marca || !precio || !estado )
            return callback( 400, { message : 'Missing required fields or not valid' } );


        const newRegister = { 
            nombre,
            marca,
            precio,
            estado,
            dateCreated : utils.dateFormat()
        };

        const dataExist = await file.read( { file : 'productos', ext : 'json' } );
        const newFile = dataExist instanceof ErrorFile ? await file.create( { file : 'productos', data : [ newRegister ], ext : 'json' } ) : dataExist.filter( element => element.nombre === nombre );
        !( dataExist instanceof ErrorFile ) && dataExist.push( newRegister );

        if ( newFile instanceof ErrorFile ) 
            return callback( 500, { message : 'The file PRODUCTOS could not be created' } );

        if ( newFile.length > 0 ) 
            return callback( 406, { message : 'The register already exist' } );

        const result = newFile.length === 0 && await file.update( { file : 'productos', data : dataExist, ext : 'json' } );
        
        if ( newFile.length === 0 && result instanceof ErrorFile )
            return callback( 500, { message : 'The file PRODUCTOS could not be updated' } );

        callback( 200, { message : 'The register was created successfully!' } );

    },
    put : async( data, callback ) => {
        const nombre = typeof( data.payload.nombre ) === 'string' && data.payload.nombre.trim().length > 0 ? data.payload.nombre.trim() : false;
        const marca = typeof( data.payload.marca ) === 'string' && data.payload.marca.trim().length > 0 ? data.payload.marca.trim() : false;
        const precio = typeof( data.payload.precio ) === 'string' && data.payload.precio.trim().length > 0 ? data.payload.precio.trim() : false;
        const estado = typeof( data.payload.estado ) === 'string' && data.payload.estado.trim().length > 0 ? data.payload.estado.trim() : false;
  
        if ( !nombre && !precio && !estado )
            return callback( 400, { message : 'Missing required fields or not valid' } );

        const dataExist = await file.read( { file : 'productos', ext : 'json' } );
        
        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file PRODUCTOS does not exist' } );
        //filtra archivos por el nombre
        const updateRegister = dataExist.filter( element => element.nombre === nombre )[ 0 ];

        if ( nombre) {
            updateRegister.nombre = nombre;
        }
        if ( marca) {
            updateRegister.marca = marca;
        }
        if ( precio ) {
            updateRegister.precio = precio;
        }
        if ( estado ) {
            updateRegister.estado = estado;
        }

        const dataAvailable = dataExist.filter( element => element.nombre !== nombre );
        dataAvailable.push( updateRegister );
        const dataUpdate = await file.update( { file : 'productos', data : dataAvailable, ext : 'json' } );
        
        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file PRODUCTOS does not exist' } );

        callback( 200, { message : 'The register was updated successfully!' } );

    },
    delete : async( data, callback ) => {
        const nombre = typeof( data.payload.nombre ) === 'string' && utils.validatenombre( data.payload.nombre.trim() ) === true ? data.payload.nombre.trim() : false;

        if ( !nombre )
            return callback( 400, { message : 'Missing the record id to update' } );

        const dataExist = await file.read( {  file : productos, ext : 'json' } );

        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file PRODUCTOS does not exist' } );
        
        const dataAvailable = dataExist.filter( element => element.nombre !== nombre );
        const dataUpdate = await file.update( { file : 'productos', data : dataAvailable, ext : 'json' } );

        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file PRODUCTOS does not exist' } );

        callback( 200, { message : 'The register was deleted successfully!' } );
    },
};

module.exports = productos;
