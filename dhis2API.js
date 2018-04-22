

function  dhis2API(){
    var request = require('request')
    
    var url = require('url'); 
    
    var requestParser = (function() {
        var href = document.location.href;
        var urlObj = url.parse(href, true);
        
        return { 
            href,
            urlObj,
            getQueryStringValue: (key) => {
                let value = ((urlObj && urlObj.query) && urlObj.query[key]) || null;
                return value;
            },
            uriMinusPath: urlObj.protocol + '//' + urlObj.hostname,
            base : urlObj.protocol+'//'+urlObj.host + "/"+urlObj.path.split("/")[1]                                  
        };  
    })();
    
    var base_url = requestParser.base;
    
    
     function update(domain,apiObject,_callback){
         request({
             method: "PUT",
             json: apiObject,
             headers :  {
                 "content-type": "application/json"
             },
            url: base_url + "/api/"+domain
         },callback);
         
         function callback(error,response,body){
             _callback(error,response,body);
         }

     }
    
    function save(domain,apiObject,_callback){
        request({
            method: "POST",
            json: apiObject,
            headers :  {
                "content-type": "application/json"
            },
            data : JSON.stringify(apiObject),
            url: base_url + "/api/"+domain
        },callback);
        
        function callback(error,response,body){
            _callback(error,response,body);
        }
        
    }
    function get(domain,_callback){
        request({
            method: "GET",
            headers : [
                {
                    name : "content-type",
                    value : "application/json"
                }
            ],
            uri: base_url + "/api/"+domain
        },callback);
        
        function callback(error,response,body){
            _callback(error,response,body);
        }
        
    }
    
    this.dataStoreService = function(dataStoreName){

        var dataStoreKeys = [];
        getKeys(function(keys){
            dataStoreKeys = keys;
        });
        
        function getKeys(callback){

            get("dataStore",function(error,body,response){
                if (error){
                }else{
                    callback(response)
                }

            })
        }

        this.getValue = function(key,_callback){
            get("dataStore/"+dataStoreName+"/"+key,function(error,response,body){
                _callback(error,response,body);
            })

        }
        
        this.saveOrUpdate = function(jsonObj,callback){

            if (!jsonObj.key){
                jsonObj.key = Math.floor(Math.random(0)*100000);
            }
debugger
            update("dataStore/"+dataStoreName+"/"+jsonObj.key,jsonObj,function(error,response,body){
                if (error || body.status == "ERROR"){
                    // may be key not exist
                    save("dataStore/"+dataStoreName+"/"+jsonObj.key,jsonObj,function(error,response,body){
                        if (error){
                            console.log("Couldn't save data store key value")
                            return
                        }
                        debugger
                    })
                }
            })
            
        }
    }
    
}

module.exports = new dhis2API();
