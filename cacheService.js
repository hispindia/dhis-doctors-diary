import idb from 'idb';

//check for support
if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}

(function() {
  'use strict';

  //check for support
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  var dbPromise = idb.open('test-db2', 1, function(upgradeDb) {
    console.log('making a new object store');
    if (!upgradeDb.objectStoreNames.contains('firstOS')) {
      upgradeDb.createObjectStore('firstOS');
    }
  });

})();


export function cacheService(){ 

    var db;
    this.init = function(key,callback){
        idb.open(key, 2, function(_db) {
            db = _db;
            callback();
        });
    }
 

  

    this.saveObjectStore = function(key,value){
        if (!db.objectStoreNames.contains(key)) {
            db.createObjectStore(key,value);
        }
        
    }
    
    function saveToCache(key,value){
        
    }
    
}

module.exports = new cacheService();
