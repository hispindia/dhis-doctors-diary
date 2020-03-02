import constants from './constants';
import cache from './localstorage';
import _api from './dhis2API';
import moment from 'moment';

function syncManager(){

    this.saveProfile = function(attrValMap,state,callback){

        var oldAttrMap = state.curr_user_data.tei.attributes.reduce(function(map,obj){
            map[obj.attribute] = obj;
            return map;
        },[]);


        for (var attrUID  in attrValMap){
            if (oldAttrMap[attrUID]){
                oldAttrMap[attrUID].value = attrValMap[attrUID];
            }else{
                state.curr_user_data.tei.attributes.push({
                    attribute : attrUID,
                    value : attrValMap[attrUID]
                })
            }
        }
        
        cache.save(constants.cache_user_prefix+state.curr_user.username,
                   state.curr_user_data);

        sendTEI(state,state.curr_user_data.tei,function(error,body,response){
            if(error){
                alert("An unexpected error occurred. Try Again Later.")
            }

            callback();
        })               
        
    }

    this.changePassword = function(state,credential,callback){

        var api = new _api(constants.DHIS_URL_BASE);
        api.setCredentials(state.curr_user_data.user.userCredentials.username, credential.oldpassword);

        var user = Object.assign({},state.curr_user_data.user);
        user.userCredentials.password = credential.newpassword;

        if (user.surname.substr(user.surname.length -1) == "|"){
            user.surname = user.surname.substring(0, user.surname.length - 1);
        }
        
        api.updateReq(`me?`,user,function(error,body,response){
            if (error){
                alert("An error occurred!" + error);
                return;
            }

            if (response.httpStatusCode == 401){
                alert("Unable to Authorize. Please make sure you entered correct current password.");
                return;
            }

            if (body.statusCode==409){
                alert(response.message);
                return;
            }
            
            if (body.statusCode=200){
                state.curr_user_data.user.password = credential.newpassword;
                state.curr_user_data.user.surname = response.surname;
                state.curr_user_data.user.displayName = response.displayName;
                
                cache.save(constants.cache_user_prefix+state.curr_user.username,
                   state.curr_user_data);
                alert("Password Changed Successfully");
                
                callback();
            }
            
        })

        function toggleAttributeValue(avals,id,value){
           
            for (var i=0;i<avals.length;i++){
                var obj = avals[i];
                if (obj.attribute.id = id){
                    obj.value = value;
                    delete obj.created;
                    delete obj.lastUpdated;
                }
            }
            return avals;
        }
    }

    
    this.fetchEvents = function(state,callback){

        var api = new _api(constants.DHIS_URL_BASE);
        api.setCredentials(state.curr_user_data.user.userCredentials.username, state.curr_user_data.user.password);

        
        api.getReq(`events.json?trackedEntityInstance=${state.curr_user_data.tei.trackedEntityInstance}&paging=false`,gotEvents);
        
        function gotEvents(error,response,body){
            if (error){
                console.log("Error Header: events fetch");
                return;
            }
            
            state.curr_user_data.events = JSON.parse(body).events;

            state.curr_user_eventMapByDate = state.curr_user_data.events.reduce(function(list,obj){
                list[moment(obj.eventDate).format("YYYY-MM-DD")] = obj;
                return list;
            },[]);
            cache.save(constants.cache_user_prefix+state.curr_user_data.user.userCredentials.username,state.curr_user_data);
            
            callback();
        }       
        
    }
    
    this.saveEvent = function(dvMap,ps,state,callback,status) {

        var event = {
            trackedEntityInstance: state.curr_user_data.tei.trackedEntityInstance,
            program: constants.program_doc_diary,
            programStage: state.curr_user_program_stage,
            orgUnit: state.curr_user_data.tei.orgUnit
        };


        if (!state.curr_event) {

            event.eventDate = state.curr_event_date;
            state.curr_user_data.events.push(event);

        }
        else {
            if (state.curr_event) {
                event = state.curr_event;
            }
        }

        if (status === "COMPLETED") {
            event.status = "COMPLETED";
            /* Support for Approval Level
               First time set approval de value to either Pending1 or Pending 2 
               based on OU Group. If CMO then ou group = DWH/DCH otherwise MOIC
            */
            dvMap[constants.approval_status_de] = state.approvalLevelDeValue;
            /* */
        }
        event.dataValues = populateDataValues();
        event.offline = true;
        state.curr_user_eventMapByDate[event.eventDate] = event;
        if (!callback) {
            state.offlineEvents = state.offlineEvents + 1;
        }
        console.log(constants.cache_user_prefix + state.curr_user.username);
        cache.save(constants.cache_user_prefix + state.curr_user.username,
            state.curr_user_data);
        state.changeView(state);
        sendEvent(state, event, callback);

        function populateDataValues(){
            return ps.programStageDataElements.reduce(function(list,obj){
            
                if(dvMap[obj.dataElement.id]){
                    list.push({
                        dataElement : obj.dataElement.id,
                        value : dvMap[obj.dataElement.id]
                    })
                }
              
                return list;
            },[])
        }        
    }


    function sendTEI(state,tei,callback){
        var api = new _api(constants.DHIS_URL_BASE);
        
        api.setCredentials(state.curr_user_data.user.userCredentials.username,
                           state.curr_user_data.user.password);


        api.updateReq(`trackedEntityInstances/${tei.trackedEntityInstance}`,tei,callback)
        
        
    }
    var isExistingEvent = false;
    var eventId = '';

    function sendEvent(state,event,callback){
        var api = new _api(constants.DHIS_URL_BASE);

        api.setCredentials(state.curr_user_data.user.userCredentials.username,
                           state.curr_user_data.user.password);
        if(checkEventExist) {
            if (!(event.event)) {
                if (isExistingEvent) {
                    console.log("new update: " + Object.entries(event));
                    api.updateReq(`events/${eventId}`, event, postSend)
                } else {
                    console.log("create: " + Object.entries(event));
                    api.saveReq(`events`, event, postSave)
                }
            } else {
                console.log("update: " + Object.entries(event));
                api.updateReq(`events/${event.event}`, event, postSend)
            }
        }
        function checkEventExist(state,event) {
            var eventDate;
            var currentEventDate = moment(event.eventDate).format("YYYY-MM-DD");
            api.getReq(
                `events.json?trackedEntityInstance=${state.curr_user_data.tei.trackedEntityInstance}`,
                function(err,response,body){
                    var events = JSON.parse(body).events;
                    for (var i = 0; i <= events.length - 1; i++) {
                        eventDate = moment(events[i].eventDate).format("YYYY-MM-DD");
                        if (eventDate === currentEventDate) {
                            isExistingEvent = true;
                            eventId = events[i].event;
                            console.log("EVENT EXIST: ");
                            return true;
                        }
                    }
                    return true;
                });
           console.log(eventId);
        }
        function postSave(error,response,body){
            if(error){
                console.log("Error : Save failed" + error);
                return;
            }
            event.event = body.response.importSummaries[0].reference;
            delete event.offline;
            state.offlineEvents = state.offlineEvents-1;

            state.changeView(state);
            cache.save(constants.cache_user_prefix+state.curr_user.username,
                       state.curr_user_data);
            if(callback){
                callback()
            }
        }

        function postSend(error,response,body){
            if(error){
                console.log("Error : Save failed" + error);
                return;
            }

            delete event.offline;
            state.offlineEvents = state.offlineEvents-1;
            state.changeView(state);
            cache.save(constants.cache_user_prefix+state.curr_user.username,
                       state.curr_user_data);
            if(callback){
                callback()
            }
        }
        
    }

}

module.exports = new syncManager();
