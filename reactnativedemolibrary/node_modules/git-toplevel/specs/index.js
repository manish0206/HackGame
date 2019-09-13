describe( 'git-toplevel', function () {
  var proxyquire = require( 'proxyquire' ).noCallThru().noPreserveCache();

  it( 'should return the top level dir', function () {
    var gitTopLevel = proxyquire( '../index.js', {
      'child_process': {
        exec: function ( method, cb ) {
          cb( null, '../git/dir' );
        }
      }
    } );

    gitTopLevel().then( function ( res ) {
      expect( res ).to.equal( '../git/dir' );
    } );
  } );

  it( 'should return the top level dir', function () {
    var gitTopLevel = proxyquire( '../index.js', {
      'child_process': {
        exec: function ( method, cb ) {
          cb( null, '../git/dir' );
        }
      }
    } );

    gitTopLevel( function ( error, res ) {
      expect( error ).to.be.null;
      expect( res ).to.equal( '../git/dir' );
    } );
  } );

  it( 'fail if an error happens', function () {
    var gitTopLevel = proxyquire( '../index.js', {
      'child_process': {
        exec: function ( method, cb ) {
          cb( new Error( 'Some Error' ) );
        }
      }
    } );

    gitTopLevel( function ( error ) {
      expect( error.message ).to.be.equal( 'Some Error' );
    } );
  } );

  it( 'fail if an error happens', function () {
    var gitTopLevel = proxyquire( '../index.js', {
      'child_process': {
        exec: function ( method, cb ) {
          cb( new Error( 'Some Error' ) );
        }
      }
    } );

    gitTopLevel().catch( function ( error ) {
      expect( error.message ).to.be.equal( 'Some Error' );
    } );
  } );

} );
