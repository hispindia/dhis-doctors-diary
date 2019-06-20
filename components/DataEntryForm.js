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
            <div className="container">
                <div className="row">
                <div className="col-sm-6 ">

                    <h2 >{ps.name}  [{moment(state.curr_event_date).format("DD MMM YYYY")}] </h2>

                    <h6 >{ utility.makeFacilityStrBelowLevel(state.curr_user_data.user.organisationUnits[0],2) } </h6>
                    <br/><br/><br/>
                     {createForm()}
                 </div>

                </div>
                <div className="row">
                <div className="col-sm-6">

                    <span className="col-sm-3"><input className="btn" type="button" value="Back" onClick={back}></input></span>
                <span className="col-sm-3"><input className={dirtyBit?"btn" : "hidden"}
                           type="button"
                           value="Save"
                           onClick={save}></input></span>

                    <span className="col-sm-3"><input
                        className={state.curr_event && state.curr_event.status == "COMPLETED" || !state.curr_event_calendar_classname.includes("entryDate")?"hidden":"btn floatRight"}
                        type="button"
                        value="Send"
                        onClick={send}></input></span>
                <span className="col-sm-3"> <label className={state.curr_event && state.curr_event.status == "COMPLETED"?"floatRight":"hidden"}
                >COMPLETED</label></span>
                </div>
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

        sync.saveEvent(dataValueMap,ps,state);
        state.curr_view = constants.views.calendar;
        // state.changeView(state);
    }

    function send(){
        if(!validate()){
            state.changeView(state);
            return;
        }

        sync.saveEvent(dataValueMap,ps,state,undefined,"COMPLETED");
        state.curr_view = constants.views.calendar;

    }

    function createForm(){

        return Object.assign([],ps.programStageDataElements)
            .reduce(function(list,obj){

                $('[data-toggle="tooltip"]').tooltip();

                list.push(createQuestion(obj));
                return list;
            },[]);
    }

    function validate(){

        return constants.required_fields.reduce(function(valid,id){
            if (!dataValueMap[id]){
                valid = false;
                dvRequiredMap[id] = "Mandatory Field!";
            }

            return valid;
        },true);
    }
    function numberValEntered(de,e){

        console.log(de.name);
        if (!e.target.value.match("^[0-9]+$") && e.target.value !="" ){
            return;
        }

        valEntered(de,e);
    }

    function valEntered(de,e){
        dirtyBit = true;
        dataValueMap[de.id] = e.target.value;
        dvRequiredMap[de.id] = "";

        instance.setState(state)

    }
    function createQuestion(de){

        return (<div
            hidden = {checkIfToHide(de.dataElement.id)}
            key ={de.id}>
            <p>{de.dataElement.formName}</p>
            <div >
                {question(de.dataElement)}
                <label>{dvRequiredMap[de.dataElement.id]?dvRequiredMap[de.dataElement.id]:""}</label>

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
            console.log(Object.values(de));
            switch(de.valueType){
                case "TEXT":
                    if (!de.optionSetValue){
                        return (<input className="form-control"
                            disabled = {checkIfDisabled(de.id)}
                            key={de.id}
                            type = "text"
                            value = {dataValueMap[de.id]?dataValueMap[de.id]:""}></input>);
                    }else{
                        return(<select className="form-control"
                            disabled = {checkIfDisabled(de.id)}
                            key={de.id}
                            value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                            onChange={valEntered.bind(null,de)}>{getOptions(de.optionSet.options)}</select>)
                    }
                case "NUMBER":
                        return (<input className="form-control" disabled = {checkIfDisabled(de.id)}
                                       key={de.id}
                                       type = "text"
                                       maxLength={3}
                                       value = {dataValueMap[de.id]?dataValueMap[de.id]:""}
                                       onChange={numberValEntered.bind(null,de)}></input>)

                case "LONG_TEXT":
                    return (<textarea className="form-control"
                        disabled = {checkIfDisabled(de.id)}
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
