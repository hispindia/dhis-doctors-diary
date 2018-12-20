import React,{propTypes} from 'react';
import cache from '../localstorage';
import moment from 'moment';
import constants from '../constants';
import sync from '../sync-manager';

export function DataEntryForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;
    var dirtyBit = false;
    var ps = state.
        program_metadata_programStageByIdMap[state.
                                             curr_user_program_stage];
    if (!ps){
        alert("Stage not assigned to user");
            return
    }
    
    
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
        return (
                <div className="entryArea">
                <div className="entryStageDiv">
                <h2>{ps.name}</h2>
                <div>
                {createForm()}
            </div>
                </div>
                <div className="entrySaveDiv">
                <input className="button" type="button" value="Save" onClick={save}></input>
                <input className="button" type="button" value="Back" onClick={back}></input>
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
        sync.saveEvent(dataValueMap,ps,state);
        state.curr_view = constants.views.calendar;
       // state.changeView(state);
    }
    
    function createForm(){
        
        return Object.assign([],ps.programStageDataElements)
            .reduce(function(list,obj){
                list.push(createQuestion(obj));
                return list;
            },[]);        
    }
    
    function valEntered(de,e){
        dirtyBit = true;
        dataValueMap[de.id] = e.target.value;
        instance.setState(state)

    }
    function createQuestion(de){

        return (<div
                className="entryQuestionDiv"
                hidden = {checkIfToHide(de.dataElement.id)}
                key ={de.id}>
                <p>{de.dataElement.name}</p>
                <div className="entryAnswerDiv">
                {question(de.dataElement)}
                </div>
                </div>)
        
        function checkIfToHide(deuid){
            if (deuid == "CCNnr8s3rgE"){
                if (!dataValueMap["OZUfNtngt0T"] || dataValueMap["OZUfNtngt0T"] != "Rejected"){
                    return true;
                }
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
                            disabled = {checkIfDisabled(de.id)}
                            key={de.id}
                            type = "text"
                            value = {dataValueMap[de.id]?dataValueMap[de.id]:""}></input>);
                }else{
                    return(<select
                           disabled = {checkIfDisabled(de.id)}
                           key={de.id}
                           value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                           onChange={valEntered.bind(null,de)}>{getOptions(de.optionSet.options)}</select>)
                }
            case "NUMBER":
                return (<input disabled = {checkIfDisabled(de.id)}
                        key={de.id}
                        type = "number"
                        value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                        onChange={valEntered.bind(null,de)}></input>);
            case "LONG_TEXT":
                return (<textarea
                        disabled = {checkIfDisabled(de.id)}
                        rows="3"
                        cols="20"
                        value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                        onChange={valEntered.bind(null,de)}
                        ></textarea>);
            }


            function checkIfDisabled(deuid){

                if (constants.disabled_fields.includes(deuid)){
                    return true
                }

                if (deuid!="x2uDVEGfY4K"){
                    if (dataValueMap["x2uDVEGfY4K"]!="Working"){
                        return true;
                    }
                }
                
                return false;
            }
         
            
            function getOptions(options){
                return options.reduce(function(list,obj){
                    list.push(<option key={obj.id} value={obj.code}>{obj.name}</option>)
                    return list;
                },[<option key = {options[0].id+"__"} disabled value={""} > -- </option>]);
            
            }
        }
        
    }
}
