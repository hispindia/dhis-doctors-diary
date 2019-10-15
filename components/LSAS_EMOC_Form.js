import React,{propTypes} from 'react';
import utility from '../utility';
import sync from '../sync-manager';
import constants from "../constants";

export function LSAS_EMOC_Form(props) {
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var doc_ehrmsid = "";

    var count = 0;

    var call_doc_ehrmsid = "";

    var allIds = [];
    var ot_num = 1;
    var mbbs_num = 1;
    var staff_num = 1;
    var ot_num_map = {
        "doc1": ot_num,
        "doc2": ot_num,
        "doc3": ot_num,
        "doc4": ot_num,
    };

    var mbbs_num_map = {
        "doc1": mbbs_num,
        "doc2": mbbs_num,
        "doc3": mbbs_num,
        "doc4": mbbs_num,
    };
    var staff_num_map = {
        "doc1": staff_num,
        "doc2": staff_num,
        "doc3": staff_num,
        "doc4": staff_num,
    };


    var checkedCall = false;

    var msgForObject = [];

    var uniqueIds = [];

    var docid = 1;

    var docMap = {
        "doc_id1": [],
        "doc_uniqueIds1": [],
        "doc_id2": [],
        "doc_uniqueIds2": [],
        "doc_id3": [],
        "doc_uniqueIds3": [],
        "doc_id4": [],
        "doc_uniqueIds4": [],
    }

    var state = props.state;

    state = {
        data: []
    };
    state.data.push({
        id: doc_ehrmsid,
        doc_id: call_doc_ehrmsid,
        onCall: checkedCall,
        mbBsDoctor: [],
        supportingStaff: [],
        otTechnician: []
    });

    if (props.currentVal) {
        try {
            //console.log("props.sendOrSave: " + props.sendOrSave);
            state = JSON.parse(props.currentVal);
        } catch (ex) {
            console.log("An error occurred while parsing object" + ex);
        }
    }

    function build_object() {

        //console.log("props.sendOrSave: " + props.sendOrSave);
        instance.props.onChangeHandler(instance.props.de,
            JSON.stringify(state),
            state.data.length,props.sendOrSave);

    }

    function idChange(doc, e) {
        doc.id = e.target.value;
        build_object();
    }

    function numberValEntered(de, e) {

        if ((!e.target.value.match("^[0-9]+$"))) {
            e.target.value = e.target.value.slice(0, e.target.value.length - 1);
            return false;
        } else {
            return true;
        }
    }

    function checkUnique(doc, e, index) {
        var flag = true;

        var index_id = docid;
        if((docid === 1 && state.data.length >= 2))
        {
            for(var i = 1;i<=state.data.length;i++){
                if(e.target.id.endsWith(""+i))
                {
                    index_id = i;
                }
            }
        }
        console.log("index id: "+index_id);
            var val1 = document.getElementById("DocId_" + (index_id));
            var val2 = document.getElementById("Partner_DocId_" + (index_id));

            if (val1.value !== "" && val2.value === "" && e.target.id == "DocId_" + (index_id)) {
                props.sendOrSave = false;
                doc_ehrmsid = "";
                doc_ehrmsid = val1.value + "";
                doc["doc_id"] = "";
                doc["id"] = (doc_ehrmsid);
                docMap["doc_id" + (index_id)].push(val1.id);
                docMap["doc_uniqueIds" + (index_id)][val1.id] = val1.value;
                build_object();
                return true;
            } else if (val1.value === "" && val2.value !== "" && e.target.id == "Partner_DocId_" + (index_id)) {
                props.sendOrSave = false;
                call_doc_ehrmsid = "";
                call_doc_ehrmsid = val2.value + "";
                doc["doc_id"] = call_doc_ehrmsid;
                doc["id"] = "";
                docMap["doc_id" + (index_id)].push(val2.id);
                docMap["doc_uniqueIds" + (index_id)][val2.id] = val2.value;
                build_object();
                return true;
            }
            if (docMap["doc_id" + (index_id)].length > 0) {
                for (var i = 0; i < docMap["doc_id" + (index_id)].length; i++) {
                    var allIds = docMap["doc_id" + (index_id)][i];
                    if (docMap["doc_uniqueIds" + (index_id)][allIds] && e.target.value === docMap["doc_uniqueIds" + (index_id)][allIds] && e.target.value != "" ) {
                        e.target.value = "";
                        alert("Please enter unique erhms id");
                        flag = false;
                    }
                }
                if (docMap["doc_uniqueIds" + (index_id)][e.target.id] != e.target.value && docMap["doc_uniqueIds" + (index_id)][e.target.id] != "") {
                    if (e.target.value != "" &&
                        (e.target.id === "mbBSId_1" + "doc" + (index_id)
                            || e.target.id === "mbBSId_2" + "doc" + (index_id))) {
                        doc.push(e.target.value);
                        props.sendOrSave = false;
                        build_object();
                    } else if (e.target.value != "" &&
                        (e.target.id === "staffId_1" + "doc" + (index_id)
                            || e.target.id === "staffId_2" + "doc" + (index_id))) {
                        doc.push(e.target.value);
                        props.sendOrSave = false;

                        build_object();
                    } else if (e.target.value != "" &&
                        (e.target.id === "otTechId_1" + "doc" + (index_id)
                            || e.target.id === "otTechId_2" + "doc" + (index_id))) {
                        doc.push(e.target.value);
                        props.sendOrSave = false;

                        build_object();
                    }

                    if(doc.length > 2 && docMap["doc_uniqueIds" + (index_id)][e.target.id])
                    {
                        var d1 = docMap["doc_uniqueIds" + (index_id)][e.target.id];
                        console.log("Previous value---------"+doc[i]);
                        for( var i = 0; i < doc.length; i++){
                            if ( doc[i] === d1) {
                                console.log("doc[i]---------"+doc[i]);
                                console.log("doc[i]---------"+d1);
                                doc.splice(index, 1);
                                build_object();
                            }
                        }
                        console.log("Data length: " + doc.length);
                    }
                    docMap["doc_id" + (index_id)].push(e.target.id);
                    docMap["doc_uniqueIds" + (index_id)][e.target.id] = e.target.value;

                }
            } else {
                docMap["doc_id" + (index_id)].push(e.target.id);
                docMap["doc_uniqueIds" + (index_id)][e.target.id] = e.target.value;
            }

        return flag;
    }

    function onCallChange(doc, e) {

        var index_id = docid;
        if((docid === 1 && state.data.length >= 2) || state.data.length >= 2) {
            for (var i = 1; i <= state.data.length; i++) {
                if (e.target.id === "checked_btn" + i) {
                    index_id = i;
                }
            }
        }

        var val1 = document.getElementById("DocId_" + (index_id));
        var checkbox = document.getElementById("checked_btn" + (index_id));
        var val2 = document.getElementById("Partner_DocId_" + (index_id));
        var val3 = document.getElementById("partner_" + (index_id));

        if (e.target.checked === true) {
            checkedCall = true;
            doc.onCall = checkedCall;
            checkbox.checked = true;
            val1.value = "";
            val1.disabled = true;
            val2.style.display = "block";
            val3.style.display = "block";
        } else {
            checkedCall = false;
            checkbox.checked = false;
            doc.onCall = checkedCall;
            val2.value = "";
            val1.disabled = false;
            val2.style.display = "none";
            val3.style.display = "none";
        }

        return true;
    }

    function addDoctor(){

        var index_id = docid;
        if((docid === 1 && state.data.length >= 2 ) || state.data.length >= 2)
        {
            index_id = state.data.length;
        }

        var val = document.getElementById("DocId_"+(index_id));
        var val2 = document.getElementById("Partner_DocId_"+(index_id));
        var checked = document.getElementById("checked_btn"+(index_id));
        //console.log("checked.value:"+checked.value)
        if(checked.value === "false" && (!val.value || val.value === ""))
        {
            alert("Please enter previous doctor ehrms id");
            return false;
        }
        else if(checked.value === "true" && (!val2.value || val2.value == ""))
        {
            alert("Please enter previous partner doctor detail");
            return false;
        }
        else{
            docid = (index_id + 1);
            state.data.push( {
                id : "",
                doc_id: "",
                onCall : false,
                mbBsDoctor : [],
                supportingStaff : [],
                otTechnician: []
            });

            props.sendOrSave = true;

            build_object();
            return true;
        }

    }

    function addMBBSDoctor(doc,e){

        var index_id = docid;
        if((docid === 1 && state.data.length >= 2) || state.data.length >= 2)
        {
            for(var i = 1;i<=state.data.length;i++){
                if(e.target.id === "mbbs_"+"btn_"+"doc"+i)
                {
                    index_id = i;
                }
            }
        }
        var val = document.getElementById("mbBSId_1"+"doc"+index_id);
        //console.log("mbbs value: "+val.value);

        if (!val.value || val.value == ""){
            alert("Please enter ehrms id in this field than add other");
            return false;
        }
        else if(doc.length <= 2){
            if(!doc.includes(val.value))
            {
                doc.push(val.value);
            }
            mbbs_num = mbbs_num + 1;
            mbbs_num_map["doc"+ index_id] = mbbs_num;
            build_object();
            return true;
        }

    }
    function addOTStaff(otStaff,e){
        var index_id = docid;
        if((docid === 1 && state.data.length >= 2) || state.data.length >= 2)
        {
            for(var i = 1;i<=state.data.length;i++){
                if(e.target.id === "ot_"+"btn_"+"doc"+i)
                {
                    index_id = i;
                }
            }
        }
        var val = document.getElementById("otTechId_1" +"doc"+index_id);
        //console.log("ot staff value: "+val.value);

        if (!val.value || val.value == ""){
            alert("Please enter ehrms id in this field than add other");
            return false;
        }
        else {
            if(!otStaff.includes(val.value))
            {
                otStaff.push(val.value);
            }
            ot_num = ot_num + 1;
            ot_num_map["doc"+ index_id ] = ot_num;
            build_object();
            return true;
        }
    }

    function addSupportStaff(staff,e){
        var index_id = docid;
        if((docid === 1 && state.data.length >= 2) || state.data.length >= 2)
        {
            for(var i = 1;i<=state.data.length;i++){
                //console.log(e.target.id);
                if(e.target.id.endsWith(""+i))
                {
                    index_id = i;
                }
            }
        }

        var val = document.getElementById("staffId_1"+"doc"+index_id);

        if (!val.value || val.value == ""){
            alert("Please enter ehrms id in this field than add other");
            return false;
        }
        else{
            if(!staff.includes(val.value))
            {
                staff.push(val.value);
            }
            staff_num = staff_num + 1;
            staff_num_map["doc"+ index_id ] = staff_num;
            build_object();
            return true;
        }

    }
    function deleteDoc(index){
        if(window.confirm("Are You Sure You want to delete this case")){
            state.data.splice(index,1);
            build_object();
            docid = state.data.length;
        }

    }

    function getDetails(){

        function getMbbsDoctor(mBbsDoc,index){
            //console.log("index: "+index);

            var inputField = (<input
                type="text"
                maxLength={6}
                id = {"mbBSId_1"+"doc"+(index+1)}
                defaultValue = {!mBbsDoc[0]?"":mBbsDoc[0]}
                onChange={numberValEntered.bind(null,mBbsDoc)}
                disabled = {instance.props.currentStatus}
                className="form-control" onBlur={checkUnique.bind(null,mBbsDoc)}></input>);

            var inputField2 = (<input
                type="text"
                maxLength={6}
                id = {"mbBSId_2"+"doc"+(index+1)}
                defaultValue = {!mBbsDoc[1]?"":mBbsDoc[1]}
                onChange={numberValEntered.bind(null,mBbsDoc)}
                disabled = {instance.props.currentStatus}
                className="form-control" onBlur={checkUnique.bind(null,mBbsDoc)}></input>);



            var addButton = (<input type="button" id={"mbbs_"+"btn_"+"doc"+(index+1)} className={mbbs_num_map["doc"+ (index+1)] === 2 || mBbsDoc.length >= 2|| instance.props.currentStatus?"hidden":"button1 button2"}  onClick={addMBBSDoctor.bind(null,mBbsDoc)} value=" + ">

            </input>);

            var firstInput = (<div><tr><td colSpan="2"><label>MBBS Doctor 1</label>{inputField}</td><td className="td_button">{addButton}</td></tr></div>);
            if (mbbs_num_map["doc"+ (index+1)] === 1 &&  mBbsDoc.length < 2 ){
                if(mBbsDoc[0] != "")
                {
                    docMap["doc_id" + (index+1)].push("mbBSId_1"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["mbBSId_1"+"doc"+(index+1)] = mBbsDoc[0];
                }
                return firstInput;
            }
            else{
                if(mBbsDoc[0] != "") {
                    docMap["doc_id" + (index+1)].push("mbBSId_1"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["mbBSId_1"+"doc"+(index+1)] = mBbsDoc[0];
                }
                if(mBbsDoc[1] != "") {
                    docMap["doc_id" + (index+1)].push("mbBSId_2"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["mbBSId_2"+"doc"+(index+1)] = mBbsDoc[1];
                }
                var ids = [];
                ids.push(firstInput);
                ids.push(<div><tr>
                    <td colSpan="2"><label>MBBS Doctor 2</label>{inputField2}</td><td className="td_button"></td>
                </tr></div>);
                return ids;
            }
        }
        function getOtTechnician(otStaff,index){

            var inputField = (<input
                type="text"
                maxLength={6}
                id = {"otTechId_1"+"doc"+ (index+1)}
                defaultValue = {!otStaff[0]?"":otStaff[0]}
                disabled = {instance.props.currentStatus}
                onChange={numberValEntered.bind(null,otStaff)}
                className="form-control" onBlur={checkUnique.bind(null,otStaff)}></input>);

            var inputField2 = (<input
                type="text"
                maxLength={6}
                id = {"otTechId_2"+"doc"+ (index+1)}
                defaultValue = {!otStaff[1]?"":otStaff[1]}
                onChange={numberValEntered.bind(null,otStaff)}
                disabled = {instance.props.currentStatus}
                className="form-control" onBlur={checkUnique.bind(null,otStaff)}></input>);

            var addButton = (<input type="button" id={"ot_btn_"+"doc"+(index+1)} className={ot_num_map["doc"+ (index+1)] === 2 || otStaff.length >= 2 || instance.props.currentStatus ?"hidden":"button1 button2"}  onClick={addOTStaff.bind(null,otStaff)} value=" + ">

            </input>);

            var firstInput = (<div><tr><td colSpan="2"><label>OT Technician 1</label>{inputField}</td><td className="td_button">  {addButton}</td></tr></div>);
            if (ot_num_map["doc"+ (index+1)] == 1 && otStaff.length < 2){
                if(otStaff[0] != "")
                {
                    docMap["doc_id" + (index+1)].push("otTechId_1"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["otTechId_1"+"doc"+(index+1)] = otStaff[0];
                }
                return firstInput;
            }

            else{
                if(otStaff[0] != "")
                {
                    docMap["doc_id" + (index+1)].push("otTechId_1"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["otTechId_1"+"doc"+(index+1)] = otStaff[0];
                }
                if(otStaff[0] != "")
                {
                    docMap["doc_id" + (index+1)].push("otTechId_2"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["otTechId_2"+"doc"+(index+1)] = otStaff[0];
                }
                var ids = [];
                ids.push(firstInput);
                ids.push(<div><tr><td colSpan="2">
                    <label>OT Technician 2</label>{inputField2}</td><td className="td_button"></td>
                </tr></div>);
                return ids;
            }
        }
        function getSupportingStaff(staff,index){

            var inputField = (<input
                type="text"
                maxLength={6}
                id = {"staffId_1"+"doc"+ (index+1)}
                defaultValue = {!staff[0]?"":staff[0]}
                onChange={numberValEntered.bind(null,staff)}
                disabled = {instance.props.currentStatus}
                className="form-control" onBlur={checkUnique.bind(null,staff)}></input>);

            var inputField2 = (<input
                type="text"
                maxLength={6}
                id = {"staffId_2"+"doc"+ (index+1)}
                defaultValue = {!staff[1]?"":staff[1]}
                onChange={numberValEntered.bind(null,staff)}
                disabled = {instance.props.currentStatus}
                className="form-control" onBlur={checkUnique.bind(null,staff)}></input>);

            var addButton = (<input type="button" id={"staff_btn_"+"doc"+(index+1)} className={staff_num_map["doc"+ (index+1)] === 2  || staff.length >= 2 || instance.props.currentStatus?"hidden":"button1 button2"}  onClick={addSupportStaff.bind(null,staff)} value=" + ">

            </input>);

            var firstInput = (<div><tr><td colSpan="2"><label>Staff Nurse 1 </label>{inputField}</td><td className="td_button">{addButton}</td></tr></div>);
            if (staff_num_map["doc"+ (index+1)] == 1 &&  staff.length < 2){
                if(staff[0] != "")
                {
                    docMap["doc_id" + (index+1)].push("staffId_1"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["staffId_1"+"doc"+(index+1)] = staff[0];
                }
                return firstInput;
            }

            else{
                if(staff[0] != "")
                {
                    docMap["doc_id" + (index+1)].push("staffId_1"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["staffId_1"+"doc"+(index+1)] = staff[0];
                }
                if(staff[0] != "")
                {
                    docMap["doc_id" + (index+1)].push("staffId_2"+"doc"+(index+1));
                    docMap["doc_uniqueIds" + (index+1)]["staffId_2"+"doc"+(index+1)] = staff[0];
                }
                var ids = [];
                ids.push(firstInput);
                ids.push(<div><tr>
                    <td colSpan="2"><label>Staff Nurse 2 </label>{inputField2}</td><td className="td_button"></td>
                </tr></div>);
                return ids;
            }
        }

        var data =state.data.reduce(function(list,obj,index){

            list.push(<div>
                <table>
                    <tbody key={"tbody"+index} className="lsasTableTbody">
                            <tr key={"DocId"+ index}>
                                <td colSpan="2">
                                    <label>
                                        {constants.lsas_emoc_data_de === instance.props.de.id?"LSAS Ehmrs Id":"EMOC Ehmrs Id" }
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        id = {"DocId_"+ (index+1)}
                                        defaultValue={!obj.id?"":obj.id}
                                        onChange={numberValEntered.bind(null,obj.id)}
                                        onBlur={checkUnique.bind(null,obj)}
                                        disabled = {instance.props.currentStatus || obj.onCall}
                                        className="form-control"></input>
                                </td>
                                <td className="td_button">
                                    <label>Doctor on call</label>
                                    <input type="checkbox"  id={"checked_btn"+(index+1)} disabled = {instance.props.currentStatus} value={obj.onCall} onChange={onCallChange.bind(null,obj)}/>
                                </td>
                                <label>
                                    <input type="button" className={(index+1) > 1 ?"redButton":"hide"} value=" X " onClick={deleteDoc.bind(null,index)}/>
                                </label>
                            </tr>
                            <tr >
                                <td colSpan="3">
                                    <label className={obj.onCall?"":"hidden"} id={"partner_"+(index+1)}>Details of Doctor on call</label>
                                    <input  defaultValue={!obj["doc_id"]?"":obj["doc_id"]} className={obj.onCall?"":"hidden"} onBlur={checkUnique.bind(null,obj)} disabled = {instance.props.currentStatus} type="text" id={"Partner_DocId_"+(index+1)}/>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    {getMbbsDoctor(obj.mbBsDoctor,index)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    {getSupportingStaff(obj.supportingStaff,index)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    {getOtTechnician(obj.otTechnician,index)}</td>
                            </tr>
                            </tbody>
                       </table>
                </div>
            );
            return list;
        },[]);
        return data;

    }

    instance.render = function(){

        if(instance.props.workingStatus!="Working"){
            return (<div></div>)
        }


        return (
            <div className="lsas" id="lsas_form">

                <table className="tableDiv">
                    <tbody >
                    <tr>
                        <td colSpan="3">
                            {getDetails()}
                        </td>

                    </tr>
                    <tr>
                        <td colSpan="3">
                            <input type="button" className={docid > 3 || state.data.length > 3 || instance.props.currentStatus ?"hide":"button1 button2"} onClick={addDoctor} value="Add Case"></input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )

    }

    return instance;

}
