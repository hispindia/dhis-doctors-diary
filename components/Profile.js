import React,{propTypes} from 'react';
import constants from '../constants';
import cache from '../localstorage';
import sync from '../sync-manager';

export function DoctorProfile(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    
    var state = props.state;
    var dirtyBit = false;

    var pTea = state.program_metadata.programTrackedEntityAttributes;

    var dvRequiredMap = [];
    var dataValueMap = [];

    if (state.curr_user_data.tei){
        dataValueMap = state.
            curr_user_data.
            tei.
            attributes.
            reduce(function(map,obj){
                map[obj.attribute] = obj.value;
                return map;
            },[]);
    }
    
        
    function textInputChangedData(name,e) {
        state[name] = e.target.value
        instance.setState(state)
    }

    
    function numberValEntered(tea,e){

        if (!e.target.value.match("^[0-9]+$")){
            return;
        }
        
        valEntered(tea,e);
    }
    
    function valEntered(tea,e){
        dirtyBit = true;
        dataValueMap[tea.trackedEntityAttribute.id] = e.target.value;
        dvRequiredMap[tea.trackedEntityAttribute.id] = "";

        instance.setState(state)

    }

    function createForm(){
        
        return Object.assign([],pTea)
            .reduce(function(list,obj){
                list.push(createQuestion(obj));
                return list;
            },[]);        
    }

    function createQuestion(tea){

        return (<div
                className="entryQuestionDiv"
                key ={tea.id}>
                <p>{tea.trackedEntityAttribute.name}</p>
                <div className="entryAnswerDiv">
                {question(tea)}
                <label>{dvRequiredMap[tea.id]?dvRequiredMap[tea.id]:""}</label>

                </div>
                </div>)

        function question(tea){
            
            switch(tea.valueType){
            case "TEXT":
                if (!tea.trackedEntityAttribute.optionSetValue){
                    return (<input
                            disabled = {checkIfDisabled(tea.trackedEntityAttribute.id)}
                            key={tea.trackedEntityAttribute.id}
                            type = "text"
                            value = {dataValueMap[tea.trackedEntityAttribute.id]?dataValueMap[tea.trackedEntityAttribute.id]:""}
                            onChange={valEntered.bind(null,tea)} ></input>);
                }else{
                    return(<select
                           disabled = {checkIfDisabled(tea.trackedEntityAttribute.id)}
                           key={tea.trackedEntityAttribute.id}
                           value = {dataValueMap[tea.trackedEntityAttribute.id]?dataValueMap[tea.trackedEntityAttribute.id]:""}
                           onChange={valEntered.bind(null,tea)}>{getOptions(tea.trackedEntityAttribute.optionSet.options)}</select>)
                }
            case "NUMBER":
                return (<input disabled = {checkIfDisabled(tea.trackedEntityAttribute.id)}
                        key={tea.trackedEntityAttribute.id}
                        type = "number"
                        value = {dataValueMap[tea.trackedEntityAttribute.id]?dataValueMap[tea.trackedEntityAttribute.id]:""}
                        onChange={numberValEntered.bind(null,tea)}></input>);
            case "LONG_TEXT":
                return (<textarea
                        disabled = {checkIfDisabled(tea.trackedEntityAttribute.id)}
                        rows="3"
                        cols="20"
                        value = {dataValueMap[tea.trackedEntityAttribute.id]?dataValueMap[tea.trackedEntityAttribute.id]:""}
                        onChange={valEntered.bind(null,tea)}
                        ></textarea>);
            case "DATE":
                return (<input
                        disabled = {checkIfDisabled(tea.trackedEntityAttribute.id)}
                        key={tea.trackedEntityAttribute.id}
                        type = "date"
                        value = {dataValueMap[tea.trackedEntityAttribute.id]?dataValueMap[tea.trackedEntityAttribute.id]:""}
                        onChange={valEntered.bind(null,tea)} ></input>);
            }
            

            function checkIfDisabled(teauid){

                
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


    function back(){
        state.curr_view = constants.views.calendar;
        state.changeView(state);    
    }
    
    function save(){
        if(!dirtyBit){
            back();
            return;
        }

  /*      if(!validate()){
            state.changeView(state);

            return;
        }
    */    
        sync.saveProfile(dataValueMap,state,function(){

        });
        state.curr_view = constants.views.calendar;
        // state.changeView(state);
    }

    instance.render = function(){
        
        return (
                <div className="entryArea">
                <div className="entryStageDiv">
                <h2>Profile</h2>
                
                <div>
                {createForm()}
            </div>
                </div>
                <div className="entrySaveDiv">
                
                <input className="button" type="button" value="Back" onClick={back}></input>
                <input className={dirtyBit?"button" : "hidden"}
            type="button"
            value="Save"
            onClick={save}></input>
                
            </div>
                </div>
        )
    }
    
    return instance;
}
