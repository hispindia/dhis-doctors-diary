import React,{propTypes} from 'react';
import cache from '../localstorage';
import moment from 'moment';
import constants from '../constants';
import sync from '../sync-manager';
import utility from '../utility';
import lsas from './LSAS_EMOC_Form';
import {LSAS_EMOC_Form} from './LSAS_EMOC_Form.js';

export function DataEntryForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var deList = [];
    var lsas_emoc = false;

    var btn_save_send = false;

    var sendOrSave = false;

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
    if(ps.name.includes("LSAS") || ps.name.includes("EmOC") )
    {
        lsas_emoc = true;
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

        if(!validate()){
            state.changeView(state);
            return;
        }
        if(window.confirm("Are You Sure You want to save data"))
        {
            if(sendOrSave && (dataValueMap[constants.emoc_data_de]))
            {
                var str = ",{\"id\":\"\",\"doc_id\":\"\",\"onCall\":false,\"mbBsDoctor\":[],\"supportingStaff\":[],\"otTechnician\":[]}";

                var data = dataValueMap[constants.emoc_data_de];
                var newStr = data.replace(str,'');
                dataValueMap[constants.emoc_data_de] = newStr;
                //console.log(dataValueMap[constants.emoc_data_de]);
            }
            else if(sendOrSave && (dataValueMap[constants.lsas_emoc_data_de]))
            {
                var str = ",{\"id\":\"\",\"doc_id\":\"\",\"onCall\":false,\"mbBsDoctor\":[],\"supportingStaff\":[],\"otTechnician\":[]}";

                var data = dataValueMap[constants.lsas_emoc_data_de];
                var newStr = data.replace(str,'');
                dataValueMap[constants.lsas_emoc_data_de] = newStr;
                //console.log(dataValueMap[constants.lsas_emoc_data_de]);
            }
            //console.log(Object.entries(dataValueMap));
            sync.saveEvent(dataValueMap,ps,state);
            state.curr_view = constants.views.calendar;
        }
        else{
            return false;
        }

        // state.changeView(state);
    }

    function send(){

        if(!validate()){
            state.changeView(state);
            return;
        }
        if(window.confirm("Are You Sure You want to send data"))
        {
            //console.log(Object.entries(dataValueMap));
            if(sendOrSave && (dataValueMap[constants.emoc_data_de]))
            {
                var str = ",{\"id\":\"\",\"doc_id\":\"\",\"onCall\":false,\"mbBsDoctor\":[],\"supportingStaff\":[],\"otTechnician\":[]}";

                var data = dataValueMap[constants.emoc_data_de];
                var newStr = data.replace(str,'');
                dataValueMap[constants.emoc_data_de] = newStr;
                //console.log(dataValueMap[constants.emoc_data_de]);
            }
            else if(sendOrSave && (dataValueMap[constants.lsas_emoc_data_de]))
            {
                var str = ",{\"id\":\"\",\"doc_id\":\"\",\"onCall\":false,\"mbBsDoctor\":[],\"supportingStaff\":[],\"otTechnician\":[]}";

                var data = dataValueMap[constants.lsas_emoc_data_de];
                var newStr = data.replace(str,'');
                dataValueMap[constants.lsas_emoc_data_de] = newStr;
                //console.log(dataValueMap[constants.lsas_emoc_data_de]);
            }
            for(var i =0;i<=dataValueMap.length; i++)
            {

                if(dataValueMap[i] == constants.lsas_emoc_data_de){

                    sync.saveEvent(dataValueMap,ps,state,undefined,"COMPLETED");
                    state.curr_view = constants.views.calendar;
                    instance.setState(state);
                }
                else if(dataValueMap[i] == constants.emoc_data_de){
                    sync.saveEvent(dataValueMap,ps,state,undefined,"COMPLETED");
                    state.curr_view = constants.views.calendar;
                    instance.setState(state)
                }
                else{
                    sync.saveEvent(dataValueMap,ps,state,undefined,"COMPLETED");
                    state.curr_view = constants.views.calendar;
                }
            }

        }
        else{
            sendOrSave = true;
            state.changeView(state);
            instance.setState(state);
            return false;
        }



    }

    function createForm(){

        return Object.assign([],ps.programStageDataElements)
            .reduce(function(list,obj){
                if(obj.dataElement.valueType === "NUMBER"){

                    deList.push(obj.dataElement.id)
                }
                list.push(createQuestion(obj));
                return list;
            },[]);
    }

    function validate(){

        var flag1 = true;
        if(dataValueMap["x2uDVEGfY4K"] === "Working"){
            for (var i=0;i<deList.length;i++){
                if (!dataValueMap[deList[i]] || dataValueMap[deList[i]] == ""){
                    flag1=false;
                    dvRequiredMap[deList[i]] = constants.sncu_mandatoryfield_message;
                }
                else{
                    flag1=true;
                }
            }
        }

        return flag1;

    }

    function numberValEntered(de,e){

        if (!e.target.value.match("^[0-9]+$") && e.target.value !=""){
            return;
        }
        deList.push(de);

        valEntered(de,e);
    }

    function valEntered(de,e){
        dirtyBit = true;
        dataValueMap[de.id] = e.target.value;
        dvRequiredMap[de.id] = "";
        //  checkSkipLogic(de.id,e.target.value)
        instance.setState(state)

    }

    function onLSAS_EMOC_Change(de,data,csections,send){
        if(de.id == constants.lsas_emoc_data_de){
            lsas_emoc = true;
            dirtyBit = true;
            dataValueMap[de.id] = data;
            sendOrSave = send;
            if(send && csections >= 2 )
            {
                csections = csections - 1;
            }
            dataValueMap["wTdcUXWeqhN"] = csections;
            dvRequiredMap[de.id] = "";
            instance.setState(state)
        }
        else if(de.id == constants.emoc_data_de){
            lsas_emoc = true;
            dirtyBit = true;
            dataValueMap[de.id] = data;
            //console.log("sendOrSave: "+send);
            if(send && csections >= 2 )
            {
                csections = csections - 1;
            }
            sendOrSave = send;
            dataValueMap["zfMOVN2lc1S"] = csections;
            dvRequiredMap[de.id] = "";
            instance.setState(state)

        }

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

        if(de.dataElement.id == 'x2uDVEGfY4K')
            return( <div
                    className="entryQuestionDiv"
                    hidden = {checkIfToHide(de.dataElement.id)}
                    key ={de.id}>
                    <table className="tableDiv">
                        <tr>
                            <td>
                                <p>{de.dataElement.formName}</p>
                            </td>
                            <td>
                                <div className="entryAnswerDiv">
                                    {question(de.dataElement)}
                                    <br></br>
                                    <label className="redColor">{dvRequiredMap[de.dataElement.id]}</label>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            )
        else return(
            <div
                className="entryQuestionDiv"
                hidden = {checkIfToHide(de.dataElement.id)}
                key ={de.id}>
                <p>{de.dataElement.formName}</p>
                <div className="entryAnswerDiv">
                    {question(de.dataElement)}
                    <br></br>
                    <label className="redColor">{dvRequiredMap[de.dataElement.id]}</label>

                </div>
            </div>
        )

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

            if (de.id == constants.lsas_emoc_data_de || de.id == constants.emoc_data_de){
                lsas_emoc = true;
                return (<LSAS_EMOC_Form
                    de={de}
                    workingStatus={dataValueMap["x2uDVEGfY4K"]}
                    currentVal = {dataValueMap[de.id]}
                    currentStatus={checkIfDisabled(de.id)}
                    sendOrSave = {sendOrSave}
                    onChangeHandler={onLSAS_EMOC_Change}
                />)
            }
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
                                   value = {dataValueMap[de.id] && dataValueMap["x2uDVEGfY4K"] === "Working"?dataValueMap[de.id]:""}
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

                if(deuid === "wTdcUXWeqhN" && lsas_emoc){
                    return true;
                }
                if(deuid === "zfMOVN2lc1S" && lsas_emoc){
                    return true;
                }
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
                        if(lsas_emoc){
                            utility.setMapExcept(dataValueMap,"",['x2uDVEGfY4K','wTdcUXWeqhN','zfMOVN2lc1S'])
                        }else{
                            utility.setMapExcept(dataValueMap,"",['x2uDVEGfY4K'])
                        }

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
