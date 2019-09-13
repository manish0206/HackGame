module.exports = function ( cb ) {
  var exec = require( 'child_process' ).exec;
  var Promise = require( 'es6-promise' ).Promise;

  var trim = require( 'jq-trim' );

  var p = new Promise( function ( resolve, reject ) {
    exec( 'git rev-parse --show-toplevel', function ( err, stdout ) {
      if ( err ) {
        reject( err );
        cb && cb( err );
        return;
      }
      var val = trim( stdout );
      resolve( val );
      cb && cb( null, val );
    } );
  } );

  return p;
};
