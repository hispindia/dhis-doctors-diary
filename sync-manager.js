import constants from './constants';
import cache from './localstorage';
import _api from './dhis2API';

function syncManager(){

    this.saveEvent = function(dvMap,ps,state){

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
        event.dataValues = populateDataValues();
        event.offline= true;
        state.curr_user_eventMapByDate[event.eventDate] = event;
        cache.save(constants.cache_user_prefix+state.curr_user.username,
                       state.curr_user_data);
        state.changeView(state);

        sendEvent(state,event);
        
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

    function sendEvent(state,event){

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
            state.changeView(state);
            cache.save(constants.cache_user_prefix+state.curr_user.username,
                       state.curr_user_data);
            
            
        }

        function postSend(error,response,body){
            if(error){
                console.log("Error : Save failed" + error);
                return;
            }

            delete event.offline;
            state.changeView(state);
            cache.save(constants.cache_user_prefix+state.curr_user.username,
                       state.curr_user_data);
            
        }
        
    }

}

module.exports = new syncManager();
