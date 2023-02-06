/** 
 * 
 * Library to make CRUD files
 * 
*/

// Dependencies
const fs = require( 'fs' );
const path = require( 'path' );
const fsPromises = fs.promises;

const baseDir = path.join( path.resolve( path.dirname( '' ) ), '/data/' );

class ErrorFile {
    constructor( error ) {
        this.message = error.code === 'NONAME' ? 'The file/directory name is missed.' : error.code === 'ENOENT' ? 'The file/directory was not found.' : error.code === 'EEXIST' ? 'Could not create the new file, it may already exist.' : error.code === 'EMPTY' ? 'The directory specified is empty.' : 'There is an undefined error with the file.';
    }
    toString() { return `File error: ${ this.message }`; }
}

const file = {
    create : async( { dir = '', file, data, ext, local = true } ) => {
        let fileDescriptor;
        const route = local ? `${ baseDir }${ dir }`: dir;
        try {
            fileDescriptor = await fsPromises.open( `${ route }/${ file }.${ ext }`, 'wx' );
            const stringData = ext === 'json' ? JSON.stringify( data ) : data;
            await fsPromises.writeFile( fileDescriptor, stringData );
            return true;
        } catch( error ) {
            return new ErrorFile( error );
        } finally {
            fileDescriptor !== undefined && await fileDescriptor.close();
        }
    },    
    read : async( { dir = '', file, ext, local = true } ) => {
        const route = local ? `${ baseDir }${ dir }`: dir;
        try {
            file = typeof( file ) === 'string' && file.length > 0 ? file : false;
            if ( !file )
                return new ErrorFile( { code : 'NONAME' } );
            const data = await fsPromises.readFile( `${ route }/${ file }.${ ext }`, 'utf-8' );
            const stringData = ext === 'json' ? JSON.parse( data ) : data;
            return stringData;
        } catch( error ) {
            return new ErrorFile( error );
        }
    },
    update : async( { dir = '', file, data, ext, local = true } ) => {
        let fileDescriptor;
        const route = local ? `${ baseDir }${ dir }`: dir;
        try {
            fileDescriptor = await fsPromises.open( `${ route }/${ file }.${ ext }`, 'r+' );
            const stringData = ext === 'json' ? `${ JSON.stringify( data ) }\r\n` : data;
            await fileDescriptor.truncate( stringData.toString().length );
            await fsPromises.writeFile( fileDescriptor, stringData );
            return true;
        } catch( error ) {
            return new ErrorFile( error );
        } finally {
            fileDescriptor !== undefined && await fileDescriptor.close();
        }
    },
    delete : async( { dir = '', file, ext, local = true } ) => {
        const route = local ? `${ baseDir }${ dir }`: dir;
        try {
            await fsPromises.unlink( `${ route }/${ file }.${ ext }` );
            return true;
        } catch( error ) {
            new ErrorFile( error );
            return false;
        }
    },
    append : async( { dir = '', file, str, ext, local = true }  ) => {
        let fileDescriptor;
        const route = local ? `${ baseDir }${ dir }`: dir;
        try {
            fileDescriptor = await fsPromises.open( `${ route }/${ file }.${ ext }`, 'a' );
            await fsPromises.appendFile( fileDescriptor, ext === 'json' ? `${ JSON.stringify( str ) },\r\n` : `${ str }\r\n` );
            return true;
        } catch( error ) {
            return new ErrorFile( error );
        } finally {
            fileDescriptor !== undefined && await fileDescriptor.close();
        }
    },    
};

module.exports = { file, ErrorFile };

