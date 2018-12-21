import constants from './constants';
import cache from './localstorage';
import _api from './dhis2API';


function loginService(){
    var api = new _api(constants.DHIS_URL_BASE);
    
    this.signin = function(username,
                           password,
                           callback){

        //fields=id,name,userCredentials[username,displayName]
        api.setCredentials(username,password);
        api.getReq(
            `users?filter=userCredentials.username:eq:${username}&fields=fields=id,name,displayName,organisationUnits[id,code,name],userAccesses,userCredentials[id,name,username],userGroups[id,code,name]`,
            function(error,response,body){
                if(error){
                    console.log("Error : Login failed");
                    return;
                }
                
                if (body){
                    
                }

                var user = JSON.parse(body).users[0];
                user.password = password;
                cache.save(constants.cache_curr_user,{"username":username})

                init(user,callback);
            });
        
    }
    
    function init(user,callback){

        programMetadata();
        
        var storage = {
            user : user,
            events : [],
            tei : []
        }

        api.getReq(`trackedEntityInstances.json?ou=${user.organisationUnits[0].id}&ouMode=DESCENDANTS&filter:${constants.attr_user}:eq:${user.userCredentials.username}&program=${constants.program_doc_diary}`,postTEI);

        function postTEI(error,response,body){
            if (error){
                console.log("Error : tei fetch");
                return;
            }
            storage.tei = JSON.parse(body).trackedEntityInstances[0];

            api.getReq(`events.json?trackedEntityInstance=${storage.tei.trackedEntityInstance}&paging=false`,gotEvents);
            
            
        }

        function gotEvents(error,response,body){
            if (error){
                console.log("Error : events fetch");
                return;
            }
            
            storage.events = JSON.parse(body).events;
            cache.save(constants.cache_user_prefix+storage.user.userCredentials.username,
                       storage);

            callback();
        }       
        
    }

    function programMetadata(){
        var md = cache.get(constants.cache_program_metadata);

        if (md != null){
            return;
        }

        api.getReq(`programs/${constants.program_doc_diary}.json?fields=id,name,programStages[id,name,programStageDataElements[id,sortOrder,dataElement[id,name,displayName,valueType,optionSetValue,optionSet[id,name,valueType,options[id,name,code]]]],userGroupAccesses]`,function(error,response,body){
            if (error){
                console.log("Error : programMetadata" + error);
                return;
            }

            cache.save(constants.cache_program_metadata,JSON.parse(body))

        });
        
        
    }
}


module.exports = new loginService();