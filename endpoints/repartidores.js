/* eslint-disable no-console */
/**
 * 
 * Repartidores handler
 * 
 */

// Dependencies
const { file, ErrorFile } = require( '../lib/files' );
const utils = require( '../lib/utils' );

const repartidores = {
    options : async( data, callback ) => {
        callback( 200 );
    },
    get : async( data, callback ) => {
        const id = typeof( data.queryStringObject.email ) === 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
        const dataExist = await file.read( { file : 'repartidores', ext : 'json' } );
        const statusCode = dataExist instanceof ErrorFile ? 500 : 200;
        const response =  dataExist instanceof ErrorFile ? { message : 'Datafile error: The file REPARTIDORES could not be created' } : id ? dataExist.filter( element => element.id === id ) : dataExist;
        callback( statusCode, response );
    },
    post : async( data, callback ) => {
        const email = typeof( data.payload.email ) === 'string' && utils.validateEmail( data.payload.email.trim() ) === true ? data.payload.email.trim() : false;
        const firstName = typeof( data.payload.firstName ) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        const lastName = typeof( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const telefono = typeof ( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const direccion = typeof ( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const vehiculo = typeof ( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const placa = typeof ( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const edad = typeof ( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        
        if ( !firstName || !lastName || !email || !telefono || !direccion || !vehiculo || !placa || !edad  )
            return callback( 400, { message : 'Missing required fields or not valid' } );

        const newRegister = { 
            username : email,
            firstName,
            lastName,
            email,
            telefono,
            direccion,
            vehiculo,
            placa,
            edad,
            dateCreated : utils.dateFormat()
        };

        const dataExist = await file.read( { file : 'repartidores', ext : 'json' } );
        const newFile = dataExist instanceof ErrorFile ? await file.create( { file : 'repartidores', data : [ newRegister ], ext : 'json' } ) : dataExist.filter( element => element.email === email );
        !( dataExist instanceof ErrorFile ) && dataExist.push( newRegister );

        if ( newFile instanceof ErrorFile ) 
            return callback( 500, { message : 'The file REPARTIDORES could not be created' } );

        if ( newFile.length > 0 ) 
            return callback( 406, { message : 'The register already exist' } );

        const result = newFile.length === 0 && await file.update( { file : 'repartidores', data : dataExist, ext : 'json' } );
        
        if ( newFile.length === 0 && result instanceof ErrorFile )
            return callback( 500, { message : 'The file REPARTIDORES could not be updated' } );

        callback( 200, { message : 'The register was created successfully!' } );

    },
    put : async( data, callback ) => {
        //verifica que los campos no esten vacios y el primero valida el email
        const email = typeof( data.payload.email ) === 'string' && utils.validateEmail( data.payload.email.trim() ) === true ? data.payload.email.trim() : false;
        const firstName = typeof( data.payload.firstName ) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        const lastName = typeof( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const telefono = typeof( data.payload.telefono ) === 'string' && data.payload.telefono.trim().length > 0 ? data.payload.telefono.trim() : false;
        const direccion = typeof( data.payload.direccion ) === 'string' && data.payload.direccion.trim().length > 0 ? data.payload.direccion.trim() : false;
        const vehiculo = typeof( data.payload.vehiculo ) === 'string' && data.payload.vehiculo.trim().length > 0 ? data.payload.vehiculo.trim() : false;
        const placa = typeof( data.payload.placa ) === 'string' && data.payload.placa.trim().length > 0 ? data.payload.placa.trim() : false;
        const edad = typeof( data.payload.edad ) === 'string' && data.payload.edad.trim().length > 0 ? data.payload.edad.trim() : false;
        if ( !email )
            return callback( 400, { message : 'Missing the record id to update' } );

        if ( !firstName && !lastName && !telefono && !direccion && !vehiculo && !placa && !edad )
            return callback( 400, { message : 'Missing required fields or not valid' } );

        
        const dataExist = await file.read( { file : 'repartidores', ext : 'json' } );
        
        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file REPARTIDORES does not exist' } );
        
        const updateRegister = dataExist.filter( element => element.email === email )[ 0 ];

        if ( firstName) {
            updateRegister.firstName = firstName;
        }
        if ( lastName ) {
            updateRegister.lastName = lastName;
        }
        if ( email ) {
            updateRegister.email = email;
        }
        if ( telefono ) {
            updateRegister.telefono = telefono;
        }
        if ( direccion ) {
            updateRegister.direccion = direccion;
        }
        if ( vehiculo ) {
            updateRegister.vehiculo = vehiculo;
        }
        if ( placa ) {
            updateRegister.placa = placa;
        }
        if ( edad ) {
            updateRegister.edad = edad;
        }

        const dataAvailable = dataExist.filter( element => element.email !== email );
        dataAvailable.push( updateRegister );
        const dataUpdate = await file.update( { file : 'repartidores', data : dataAvailable, ext : 'json' } );
        
        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file REPARTIDORES does not exist' } );

        callback( 200, { message : 'The register was updated successfully!' } );

    },
    delete : async( data, callback ) => {
        const email = typeof( data.payload.email ) === 'string' && utils.validateEmail( data.payload.email.trim() ) === true ? data.payload.email.trim() : false;

        if ( !email )
            return callback( 400, { message : 'Missing the record id to update' } );

        const dataExist = await file.read( {  file : repartidores, ext : 'json' } );

        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file REPARTIDORES does not exist' } );
        
        const dataAvailable = dataExist.filter( element => element.email !== email );
        const dataUpdate = await file.update( { file : 'repartidores', data : dataAvailable, ext : 'json' } );

        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file REPARTIDORES does not exist' } );

        callback( 200, { message : 'The register was deleted successfully!' } );
    },
};

module.exports = repartidores;
