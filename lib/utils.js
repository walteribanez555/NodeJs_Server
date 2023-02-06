/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/**
 * 
 * Utils for various tasks
 * 
 */

// Dependencies
const crypto = require( 'crypto' );
const hashingSecret = 'MySecret';
const day = new Date();

const utils = {
    hash : str => {
        const hash = typeof( str ) === 'string' && str.length > 0 ? crypto.createHmac( 'sha256', hashingSecret ).update( str ).digest( 'hex' ) : false;
        return hash;
    },
    validateEmail : emailAddress => {
        const regExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        return regExp.test( emailAddress ) ? true : false;
    },
    dateFormat : () => {
        const toDay = `${ day.getFullYear() }-${ ('0' + ( day.getMonth() + 1 ) ).slice( -2 ) }-${ ( '0' + day.getDate() ).slice( -2 ) }T${ ( '0' + day.getHours() ).slice( -2 ) }:${ ( '0' + day.getMinutes() ).slice( -2 ) }:${ ( '0' + day.getSeconds() ).slice( -2 ) }`;
        return toDay;
    },
    parseJsonToObject : str => ( str && str.length > 0 ? JSON.parse( str ) : {} ),
};

module.exports = utils;