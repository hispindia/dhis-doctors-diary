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
            `users?filter=userCredentials.username:eq:${username}&fields=*`,
            function(error,response,body){
                if(error){
                    console.log("Error : Login failed");
                    return;
                }
                
                if (body){
                    
                }

                var user = JSON.parse(body).users[0];
                user.password = password;
                init(user);
            });
        
    }
    
    function loginSuccessfull(user){

        // save to cache
        init(user);
    }

    function init(user,pswd){
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
            cache.save("dd_"+storage.user.userCredentials.username,
                       storage);
        }

        
    }
}


module.exports = new loginService();
