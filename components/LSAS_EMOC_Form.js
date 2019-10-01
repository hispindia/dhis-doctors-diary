import React,{propTypes} from 'react';
import utility from '../utility';
import sync from '../sync-manager';
import constants from "../constants";

export function LSAS_EMOC_Form(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;


    var allIds = [];
    var ot_num = 1;
    var mbbs_num = 1;
    var staff_num = 1;
    var ot_num_map = {
        "doc1" : ot_num,
        "doc2" : ot_num,
        "doc3" : ot_num,
        "doc4" : ot_num,
    };

    var mbbs_num_map = {
        "doc1" : mbbs_num,
        "doc2" : mbbs_num,
        "doc3" : mbbs_num,
        "doc4" : mbbs_num,
    };
    var staff_num_map = {
        "doc1" : staff_num,
        "doc2" : staff_num,
        "doc3" : staff_num,
        "doc4" : staff_num,
    };


    var checkedCall = false;

    var msgForObject = [];

    var uniqueIds = [];

    var docid = 1;

    var state = props.state;

    state = {
        data : []
    };
    state.data.push( {
        id : "",
        onCall : checkedCall,
        mbBsDoctor : [],
        supportingStaff : [],
        otTechnician: []
    });

    if (props.currentVal){
        try{
            state = JSON.parse(props.currentVal);
        }catch(ex){
            console.log("An error occurred while parsing object"+ex);
        }
    }
    function build_object() {
        instance.props.onChangeHandler(instance.props.de,
            JSON.stringify(state),
            state.data.length);
    }
    function idChange(doc,e){
        doc.id = e.target.value;
        build_object();
    }
    function numberValEntered(de,e){

        if ((!e.target.value.match("^[0-9]+$"))){
            e.target.value = e.target.value.slice(0,e.target.value.length - 1);
            return false;
        }
        else{
            return true;
        }
    }

    function checkUnique(doc,e)
    {
        var val1 = document.getElementById("DocId_"+docid);
        var val2 = document.getElementById("Partner_DocId_"+docid);

        if(val1.value !== "" && val2.value == "" && e.target.id == "DocId_"+docid)
        {
            console.log("Doc id:"+e.target.id);
            doc = val1.value;
            build_object();
            return true;
        }
        else if(val1.value == "" && val2.value !== "" && e.target.id == "Partner_DocId_"+docid)
        {
            doc = val2.value;
            build_object();
            return true;
        }
        var flag = true;
        if(allIds.length > 0) {
            for (var i =0;i< allIds.length;i++)
            {
                if (uniqueIds[allIds[i]] && e.target.value === uniqueIds[allIds[i]] && e.target.value != "") {
                    console.log("id: " + e.target.id);
                    e.target.value = "";
                    alert("Please enter unique erhms id");
                    flag = false;
                }
            }
                    allIds.push(e.target.id);
                    uniqueIds[e.target.id] = e.target.value;
        }
        else{
            allIds.push(e.target.id);
            uniqueIds[e.target.id] = e.target.value;
        }
        if(!uniqueIds[e.target.id] && uniqueIds[e.target.id] != "")
        {
            doc.push(uniqueIds[e.target.id]);
            build_object();
        }
        return flag;
    }
    function onCallChange(doc,e){
        var val1 = document.getElementById("DocId_"+docid);
        var val2 = document.getElementById("Partner_DocId_"+docid);
        var val3 = document.getElementById("partner_"+docid);

        if(e.target.checked === true)
        {
            checkedCall = true;
            doc.onCall = checkedCall;
            val1.value = "";
            val1.disabled = true;
            val2.style.display = "block";
            val3.style.display = "block";
        }
        else{
            checkedCall = false;
            doc.onCall = checkedCall;
            val2.value = "";
            val1.disabled = false;
            val2.style.display = "none";
            val3.style.display = "none";
        }
        return true;
    }

    function addDoctor(){
        allIds = [];
        uniqueIds = [];
        var val = document.getElementById("DocId_"+docid);
        var val2 = document.getElementById("Partner_DocId_"+docid);
        if(!checkedCall && (!val.value || val.value == ""))
        {
            alert("Please enter previous doctor ehrms id");
            return false;
        }
        else if(checkedCall && (!val2.value || val2.value == ""))
        {
            alert("Please enter previous partner doctor detail");
            return false;
        }
        else{
            docid = docid + 1;
            state.data.push( {
                id : "",
                onCall : false,
                mbBsDoctor : [],
                supportingStaff : [],
                otTechnician: []
            });
            build_object();
            return true;
        }

    }

    function addMBBSDoctor(doc,e){

        var val = document.getElementById("mbBSId_"+mbbs_num);
        console.log("mbbs value: "+val.value);

        if (!val.value || val.value == ""){
            alert("Please enter ehrms id in this field than add other");
            return false;
        }
        else if(doc.length <= 2){
            doc.push(val.value);
            mbbs_num = mbbs_num + 1;
            mbbs_num_map["doc"+ docid] = mbbs_num;
            build_object();
            return true;
        }

    }
    function addOTStaff(otStaff,e){
        var val = document.getElementById("otTechId_"+ot_num);
        console.log("ot staff value: "+val.value);

        if (!val.value || val.value == ""){
            alert("Please enter ehrms id in this field than add other");
            return false;
        }
        else {
            otStaff.push(val.value);
            ot_num = ot_num + 1;
            ot_num_map["doc"+ docid ] = ot_num;
            build_object();
            return true;
        }
    }

    function addSupportStaff(staff,e){
        var val = document.getElementById("staffId_"+staff_num);
        console.log("staff value: "+val.value);

        if (!val.value || val.value == ""){
            alert("Please enter ehrms id in this field than add other");
            return false;
        }
        else{
            staff.push(val.value);
            staff_num = staff_num + 1;
            staff_num_map["doc"+ docid ] = staff_num;
            build_object();
            return true;
        }

    }
    function checkIfDisabled() {

        if (state.curr_event && state.curr_event.status == "COMPLETED") {
            return true;
        }
    }
    function getDetails(){

        function getMbbsDoctor(mBbsDoc){
            console.log(mbbs_num);

            var inputField = (<div><input
                type="text"
                maxLength={6}
                id = {"mbBSId_"+ mbbs_num}
                onChange={numberValEntered.bind(null,mBbsDoc)}
                disabled = {checkIfDisabled}
                className="form-control" onBlur={checkUnique.bind(null,mBbsDoc)}></input></div>);

            var addButton = (<div><input type="button" className={mbbs_num_map["doc"+ docid] === 2?"hidden":"button1 button2"}  onClick={addMBBSDoctor.bind(null,mBbsDoc)} value=" + ">

            </input></div>);

            var firstInput = (<div><td className="td_name">MBBS Doctor 1</td><td className="td_field">{inputField}</td><td className="td_button">{addButton}</td></div>);
            if (mBbsDoc.length == 0){
                return firstInput;
            }

            var ids = mBbsDoc.reduce(function(list,mbbs_staff,index){
                list.push(firstInput);
                list.push(<div>
                    <td className="td_name">MBBS Doctor 2 </td><td className="td_field">{inputField}</td><td></td>
                </div>);
                return list;
            },[]);
            return ids;

        }
        function getOtTechnician(otStaff){

            var inputField = (<div><input
                type="text"
                maxLength={6}
                id = {"otTechId_"+ ot_num}
                disabled = {checkIfDisabled}
                onChange={numberValEntered.bind(null,otStaff)}
                className="form-control" onBlur={checkUnique.bind(null,otStaff)}></input></div>);

            var addButton = (<div><input type="button" className={ot_num_map["doc"+ docid] === 2?"hidden":"button1 button2"}  onClick={addOTStaff.bind(null,otStaff)} value=" + ">

                 </input></div>);

            var firstInput = (<div><td className="td_name">OT Technician 1</td><td className="td_field">{inputField}</td><td className="td_button">  {addButton}</td></div>);
            if (otStaff.length == 0){
                return firstInput;
            }

            var ids = otStaff.reduce(function(list,ot_staff,index){
                list.push(firstInput);
                list.push(<div>
                    <td className="td_name">OT Technician 2 </td><td className="td_field">{inputField}</td><td></td>
                </div>);
                return list;
            },[]);
            return ids;
        }
        function getSupportingStaff(staff){

            var inputField = (<div><input
                type="text"
                maxLength={6}
                id = {"staffId_"+ staff_num}
                onChange={numberValEntered.bind(null,staff)}
                disabled = {checkIfDisabled}
                className="form-control" onBlur={checkUnique.bind(null,staff)}></input></div>);

            var addButton = (<div><input type="button" className={staff_num_map["doc"+ docid] === 2 ==2?"hidden":"button1 button2"}  onClick={addSupportStaff.bind(null,staff)} value=" + ">

            </input></div>);

            var firstInput = (<div><td className="td_name">Staff Nurse 1</td><td className="td_field">{inputField}</td><td className="td_button">  {addButton}</td></div>);
            if (staff.length == 0){
                return firstInput;
            }

            var ids = staff.reduce(function(list,staff_nusre,index){
                list.push(firstInput);
                list.push(<div>
                    <td className="td_name">Staff Nurse 2 </td><td className="td_field" >{inputField}</td><td></td>
                </div>);
                return list;
            },[]);
            return ids;
        }


        var data =state.data.reduce(function(list,obj,index){

            list.push(<tbody key={"tbody"+index} className="lsasTableTbody">
                      <tr key={"DocId"+ index}>
                     <td className="td_name">
                         {constants.lsas_emoc_data_de?"Emoc Ehmrs Id":"Lsas Ehmrs Id" }
                     </td>
                      <td className="td_field">
                          <input
                                 type="text"
                                 maxLength={6}
                                 id = {"DocId_"+ docid}
                                 onChange={numberValEntered.bind(null,obj.id)}
                                 onBlur={checkUnique.bind(null,obj.id)}
                                 disabled={checkedCall}
                                 className="form-control"></input>

                      </td>
                      <td className="td_button">
                           <input type="checkbox" value={obj.onCall} onChange={onCallChange.bind(null,obj)}/>
                      </td>
                     </tr>
                     <tr className="hidden" id={"partner_"+docid}>
                            <td colSpan="3">Details of Doctor on call</td>
                     </tr>
                      <tr >
                          <td colSpan="3"><input className="hidden"  type="text" id={"Partner_DocId_"+docid}/></td>
                      </tr>
                      <tr>
                          <td colSpan="3">
                              {getMbbsDoctor(obj.mbBsDoctor)}</td>
                      </tr>
                      <tr>
                          <td colSpan="3">
                              {getSupportingStaff(obj.supportingStaff)}</td>
                      </tr>
                      <tr>
                          <td colSpan="3">
                          {getOtTechnician(obj.otTechnician)}</td>
                      </tr>

                      </tbody>
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
                <div className="lsas">
                <table>
                 <tbody >
                 <tr>
                   <td colSpan="3">
                        {getDetails()}
                    </td>
                 </tr>
                  <tr>
                    <td colSpan="3">
                        <input type="button" className={docid > 3 ?"hide":"button1 button2"} onClick={addDoctor} value="Add Case"></input>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        )
    }
    return instance;

}
