/* eslint-disable no-console */
/**
 * 
 * USERS handler
 * 
 */

// Dependencies
const { file, ErrorFile } = require( '../lib/files' );
const utils = require( '../lib/utils' );

const users = {
    options : async( data, callback ) => {
        callback( 200 );
    },
    get : async( data, callback ) => {
        const email = typeof( data.queryStringObject.email ) === 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
        const dataExist = await file.read( { file : 'users', ext : 'json' } );
        const statusCode = dataExist instanceof ErrorFile ? 500 : 200;
        const response =  dataExist instanceof ErrorFile ? { message : 'Datafile error: The file USERS could not be created' } : id ? dataExist.filter( element => element.id === id ) : dataExist;
        callback( statusCode, response );
    },
    post : async( data, callback ) => {
        const email = typeof( data.payload.email ) === 'string' && utils.validateEmail( data.payload.email.trim() ) === true ? data.payload.email.trim() : false;
        const firstName = typeof( data.payload.firstName ) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        const lastName = typeof( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const password = typeof( data.payload.password ) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
        const confirm = typeof( data.payload.confirm ) === 'string' && data.payload.confirm.trim().length > 0 ? data.payload.confirm.trim() : false;

        if ( !firstName || !lastName || !email || !password || !confirm )
            return callback( 400, { message : 'Missing required fields or not valid' } );

        if ( password !== confirm )
            return callback( 400, { message : 'Password confirmation does not match password' } );

        const newRegister = { 
            username : email,
            firstName,
            lastName,
            email,
            hashedPassword : utils.hash( password ),
            dateCreated : utils.dateFormat()
        };

        const dataExist = await file.read( { file : 'users', ext : 'json' } );
        const newFile = dataExist instanceof ErrorFile ? await file.create( { file : 'users', data : [ newRegister ], ext : 'json' } ) : dataExist.filter( element => element.email === email );
        !( dataExist instanceof ErrorFile ) && dataExist.push( newRegister );

        if ( newFile instanceof ErrorFile ) 
            return callback( 500, { message : 'The file USERS could not be created' } );

        if ( newFile.length > 0 ) 
            return callback( 406, { message : 'The register already exist' } );

        const result = newFile.length === 0 && await file.update( { file : 'users', data : dataExist, ext : 'json' } );
        
        if ( newFile.length === 0 && result instanceof ErrorFile )
            return callback( 500, { message : 'The file USERS could not be updated' } );

        callback( 200, { message : 'The register was created successfully!' } );

    },
    put : async( data, callback ) => {
        const email = typeof( data.payload.email ) === 'string' && utils.validateEmail( data.payload.email.trim() ) === true ? data.payload.email.trim() : false;
        const firstName = typeof( data.payload.firstName ) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        const lastName = typeof( data.payload.lastName ) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const password = typeof( data.payload.password ) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
        const confirm = typeof( data.payload.confirm ) === 'string' && data.payload.confirm.trim().length > 0 ? data.payload.confirm.trim() : false;

        if ( !email )
            return callback( 400, { message : 'Missing the record id to update' } );

        if ( !firstName && !lastName && !password && !confirm )
            return callback( 400, { message : 'Missing required fields or not valid' } );

        if ( password !== confirm )
            return callback( 400, { message : 'Password confirmation does not match password' } );

        const dataExist = await file.read( { file : 'users', ext : 'json' } );
        
        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file USERS does not exist' } );
        
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
        if ( password ) {
            updateRegister.hashedPassword = utils.hash( password );
        }

        const dataAvailable = dataExist.filter( element => element.email !== email );
        dataAvailable.push( updateRegister );
        const dataUpdate = await file.update( { file : 'users', data : dataAvailable, ext : 'json' } );
        
        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file USERS does not exist' } );

        callback( 200, { message : 'The register was updated successfully!' } );

    },
    delete : async( data, callback ) => {
        const email = typeof( data.payload.email ) === 'string' && utils.validateEmail( data.payload.email.trim() ) === true ? data.payload.email.trim() : false;

        if ( !email )
            return callback( 400, { message : 'Missing the record id to update' } );

        const dataExist = await file.read( {  file : users, ext : 'json' } );

        if ( dataExist instanceof ErrorFile ) 
            return callback( 500, { message : 'The file USERS does not exist' } );
        
        const dataAvailable = dataExist.filter( element => element.email !== email );
        const dataUpdate = await file.update( { file : 'users', data : dataAvailable, ext : 'json' } );

        if ( dataUpdate instanceof ErrorFile ) 
            return callback( 500, { message : 'The file USERS does not exist' } );

        callback( 200, { message : 'The register was deleted successfully!' } );
    },
};

module.exports =users;
