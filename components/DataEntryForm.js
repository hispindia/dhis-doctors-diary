import React,{propTypes} from 'react';
import cache from '../localstorage';
import moment from 'moment';
import constants from '../constants';
import sync from '../sync-manager';
import utility from '../utility';

export function DataEntryForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;
    var dirtyBit = false;
    var ps = state.
        program_metadata_programStageByIdMap[state.
                                             curr_user_program_stage];
    var error;
    if (!ps){
        //alert("Stage not assigned to user");
        error = "User does not have access to any form.";
    }
    
    var dvRequiredMap = [];
    var dataValueMap = [];
    if (state.curr_event){
        dataValueMap = state.
            curr_event.
            dataValues.
            reduce(function(map,obj){
                map[obj.dataElement] = obj.value;
                return map;
            },[]);
    }
    
    instance.render = function(){
        if (error){
            return (<label>{error}</label>)
        }
        return (
                <div className="entryArea">
                <div className="entryStageDiv">
                    <h4>{ps.name}  [{moment(state.curr_event_date).format("DD MMM YYYY")}] </h4>
                    <h6>{ utility.makeFacilityStrBelowLevel(state.curr_user_data.user.organisationUnits[0],2) } </h6>
                <div>
                {createForm()}
            </div>
                </div><br/>
                <div className="entrySaveDiv">
                
                <input className="button1 button2" type="button" value="Back" onClick={back}></input>
  <input className={dirtyBit?"button1 button2" : "hidden"}
            type="button"
            value="Save"
            onClick={save}></input>
              
                <input
            className={state.curr_event && state.curr_event.status == "COMPLETED" || !state.curr_event_calendar_classname.includes("entryDate")?"hidden":"button1 button2 floatRight"}
            type="button"
            value="Send"
            onClick={send}></input>
                <label className={state.curr_event && state.curr_event.status == "COMPLETED"?"floatRight":"hidden"}
>COMPLETED</label>
                </div>
            </div>
        )
    }
    return instance;

    function back(){
        state.curr_view = constants.views.calendar;
        state.changeView(state);    
    }
    
    function save(){

        if(!dirtyBit){
            back();
            return;
        }

        if(!validate()){
            state.changeView(state);

            return;
        }

        if (!sncu_validate(ps.id)){
            instance.setState(state);
            scroll(0,0);
            return           
        }
        sync.saveEvent(dataValueMap,ps,state);
        state.curr_view = constants.views.calendar;
       // state.changeView(state);
    }

    function send(){
        if(!validate()){
            instance.setState(state);
            scroll(0,0);
            return;
        }

        
        if (!sncu_validate(ps.id)){
            instance.setState(state);
            scroll(0,0);
            return           
        }
        
        sync.saveEvent(dataValueMap,ps,state,undefined,"COMPLETED");
        state.curr_view = constants.views.calendar;

    }

    function createForm(){
        
        return Object.assign([],ps.programStageDataElements)
            .reduce(function(list,obj){
                list.push(createQuestion(obj));
                return list;
            },[]);        
    }

    function validate(){

        return constants.required_fields.reduce(function(valid,id){
            console.log(dataValueMap[id]);
            if (!dataValueMap[id]){
                valid = false;
                dvRequiredMap[id] = constants.sncu_mandatoryfield_message;
            }

            return valid;
        },true);
    }

    function numberValEntered(de,e){

        if (!e.target.value.match("^[0-9]+$") && e.target.value !=""){
            return;
        }
        constants.required_fields.includes(de.id);
        dvRequiredMap[de.id]  = e.target.value
        dvRequiredMap[de];
        valEntered(de,e);
    }
    
    function valEntered(de,e){
        dirtyBit = true;
        dataValueMap[de.id] = e.target.value;
      //  checkSkipLogic(de.id,e.target.value)
        dvRequiredMap[de.id] = "";
        validate();

        instance.setState(state)

    }

    function checkSkipLogic(de,val){

        if (constants.sncu_mandatoryfield.includes(de)){
            debugger
            if (val<=0){
                dvRequiredMap[de.id] = constants.picu_mandatoryfield_message;
                return true;
            }
        }
        return false;
    }

    function sncu_validate(psid){
        
        if (psid != constants.picu_ps_uid){
            return true;
        }
        
        if (dataValueMap["x2uDVEGfY4K"]!="Working"){
            return true;
        }
        
        var fields= constants.sncu_mandatoryfield;
        var flag = true;
        for (var i=0;i<fields.length;i++){
            if (!dataValueMap[fields[i]] || dataValueMap[fields[i]] == ""){
                flag=false;
                dvRequiredMap[fields[i]] = constants.sncu_mandatoryfield_message;
            }
        }
        return flag;
    }

    
    function createQuestion(de){

        return (<div
                className="entryQuestionDiv"
                hidden = {checkIfToHide(de.dataElement.id)}
                key ={de.id}>
                <p>{de.dataElement.formName}</p>
                <div className="entryAnswerDiv">
                {question(de.dataElement)}
                <br></br>
                <label className="dvRequired">{dvRequiredMap[de.dataElement.id]}</label>

                </div>
                </div>)
        
        function checkIfToHide(deuid){
            if (deuid == constants.rejection_reason_de){
                if (dataValueMap[constants.approval_status_de] != constants.approval_status.rejected){
                    return true;
                }
            }

            switch(deuid){
            case 'Ed0bvGMTYSS' :
                if (dataValueMap[constants.other_duties_de] != 'vipduties'){
                    return true;
                }
                break
            case 'uNVcN37zGxj':
                if (dataValueMap[constants.other_duties_de] != 'medico legal'){
                    return true;
                }
                break
            case 'lMlGVCVgR8C':
                if (dataValueMap[constants.other_duties_de] != 'jailduties'){
                    return true;
                }
                break
            case 'mbrP2IkXW4s':
                if (dataValueMap[constants.other_duties_de] != 'otherduties'){
                    return true;
                }
                break
                
            }
            
            return false;
        }
        
        function checkIfMandatory(deuid){            
            if (constants.required_fields.includes(deuid)){
                return true
            }
            return false;
        }
        
        function question(de){

            switch(de.valueType){
            case "TEXT":
                if (!de.optionSetValue){
                    return (<input
                            className="form-control"
                            disabled = {checkIfDisabled(de.id)}
                            key={de.id}
                            type = "text"
                            value = {dataValueMap[de.id]?dataValueMap[de.id]:""} required></input>);
                }else{
                    return(<select
                           className="form-control"
                           disabled = {checkIfDisabled(de.id)}
                           key={de.id}
                           value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                           onChange={valEntered.bind(null,de)}>{getOptions(de.optionSet.options)}</select>)
                }
            case "NUMBER":
                return (<input disabled = {checkIfDisabled(de.id)}
                        className="form-control"
                        key={de.id}
                        id={de.id}
                        type = "text"
                        maxLength={utility.getAttributeValueFromId(de.attributeValues,constants.numeric_de_maxlength)}
                        value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                        onChange={numberValEntered.bind(de.id,de)} ></input>);
            case "LONG_TEXT":
                return (<textarea
                        className="form-control"
                        disabled = {checkIfDisabled(de.id)}
                        key={de.id}
                        rows="3"
                        cols="20"
                        value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                        onChange={valEntered.bind(null,de)}
                        ></textarea>);
            }


            function checkIfDisabled(deuid){

                if (!state.curr_event_calendar_classname.includes("entryDate")){
                    return true;
                }

                if (state.curr_event && state.curr_event.status=="COMPLETED"){
                    return true;
                }
                    
                if (constants.disabled_fields.includes(deuid)){
                    return true
                }

                if (deuid!="x2uDVEGfY4K"){
                    if (dataValueMap["x2uDVEGfY4K"]!="Working"){
                        utility.setMapExcept(dataValueMap,"",['x2uDVEGfY4K'])
                        return true;
                    }
                }
                
                return false;
            }
         
            
            function getOptions(options){
                return options.reduce(function(list,obj){
                    list.push(<option key={obj.id} value={obj.code}>{obj.name}</option>)
                    return list;
                },[<option key = {options[0].id+"__"} disabled value={""} > --Select-- </option>]);
            
            }
        }
        
    }
}
