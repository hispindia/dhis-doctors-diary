import constants from './constants';
import cache from './localstorage';
import _api from './dhis2API';
import moment from 'moment';

function syncManager(){

    this.saveProfile = function(attrValMap,state,callback){

        state.curr_user_data.tei.attributes.forEach(function(obj,index){
            if (attrValMap[obj.attribute]){
                obj.value = attrValMap[obj.attribute];
            }
        })

        
        debugger
        
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
    
    this.saveEvent = function(dvMap,ps,state,callback,status){

        var event = {
            trackedEntityInstance : state.curr_user_data.tei.trackedEntityInstance,
            program :constants.program_doc_diary,
            programStage : state.curr_user_program_stage,
            orgUnit : state.curr_user_data.tei.orgUnit
        };
        
     
        if (!state.curr_event){

            event.eventDate = state.curr_event_date;            
            state.curr_user_data.events.push(event);

        }else{
            if (state.curr_event){
                event = state.curr_event;
            }
        }

        if (status == "COMPLETED"){
            event.status = "COMPLETED";
        }
        event.dataValues = populateDataValues();
        event.offline= true;
        state.curr_user_eventMapByDate[event.eventDate] = event;
        if(!callback){
            state.offlineEvents = state.offlineEvents+1;
        }
        cache.save(constants.cache_user_prefix+state.curr_user.username,
                       state.curr_user_data);
        state.changeView(state);
        sendEvent(state,event,callback);
        
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

    function sendEvent(state,event,callback){

        //check for offline


        var api = new _api(constants.DHIS_URL_BASE);

        api.setCredentials(state.curr_user_data.user.userCredentials.username,
                           state.curr_user_data.user.password);

        if (!event.event){
            api.saveReq(`events`,event,postSave)
        }else{
            api.updateReq(`events/${event.event}`,event,postSend)
        
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
