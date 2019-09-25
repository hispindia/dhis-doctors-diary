import React,{propTypes} from 'react';
import utility from '../utility';

export function LSAS_EMOC_Form(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var allIds = [];

    var uniqueIds = [];

    var num = 0;
    
    var state = {
        data : []        
    };

    if (props.currentVal){
        try{
            state = JSON.parse(props.currentVal);
        }catch(ex){
            console.log("An error occurred while parsing object"+ex);
        }
    }
    function build_object(){
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
        var flag = true;

        if(allIds.length > 0) {
            for (var i =0;i< allIds.length;i++)
            {
                if (e.target.value === uniqueIds[allIds[i]]) {
                    console.log("c: " + e.target.value);
                    console.log("p: " + uniqueIds[allIds[i]]);
                    e.target.value = "";
                    alert("Please Enter Unique Value");
                    return false;
                }
            }
                if(!uniqueIds[e])
                {
                    allIds.push(e) ;
                    uniqueIds[e] = e.target.value;
                }


        }
        else{
            allIds.push(e) ;
            uniqueIds[e] = e.target.value;
        }

        return flag;
    }
    function onCallChange(doc,e){
        doc.onCall = e.target.value;
        build_object();
    }
    
    function addDoctor(){
        state.data.push( {
                id : "",
                onCall : false,
                supportingStaff : []
        });
        build_object();
    }

    function deleteDoc(index){
        state.data.splice(index,1);
        build_object();
    }
    
    function deleteStaff(index,staff){
        staff.splice(index,1);
        build_object();        
    }
    function addSupportStaff(staff,e){
        var val = e.target.parentElement.children[0].value;
        if (!val || val==""){return}
        staff.push(val);

        build_object();        
    }

    function getDetails(){

        function getSupportingStaff(staff){
            
            var addButton = (<tr key={Math.random(2)}><td>
                             <input
                                 type="text"
                                 maxLength={6}
                                 onChange={numberValEntered.bind(null,staff)}
                                 className="form-control" onBlur={checkUnique.bind(null,staff)}></input>
                             <input type="button" className="button1 button2"  onClick={addSupportStaff.bind(null,staff)} value="Add Staff"></input>
                             </td></tr>);
            
            if (staff.length == 0){
                return addButton;
            }
            
            var ids = staff.reduce(function(list,obj,index,staff){
                list.push(<tr key={Math.random(1)}>
                          <td>Staff{index+1}   <input type="button" className="button1 button2"
                          onClick={deleteStaff.bind(null,index,staff)}
                          value="Delete"></input></td>
                          <td>{obj}</td>
                          </tr>);
                return list;
            },[]);

            ids.push(addButton);
            
            return ids;
        }


        return state.data.reduce(function(list,obj,index){
            
            list.push(<tbody key={"tbody"+index} className="lsasTableTbody">
                      <tr key={"DocId"+ index}>
                     <td>
                      Doctor Id : </td>
                      <td><input
                                 type="text"
                                 maxLength={6}
                                 onChange={numberValEntered.bind(null,obj)}
                                 onBlur={checkUnique.bind(null,obj)}
                                 className="form-control" ></input>

                     </td>
                     </tr>
                     <tr key={"onCall"+ index}>
                     <td>On Call?</td>
                      <td> <select className="form-control" value={obj.onCall} onChange={onCallChange.bind(null,obj)}>
                     <option value="true">yes</option>
                     <option value="false">No</option>
                     </select>
                     </td>
                     </tr>
                      Support Staff:
                      {getSupportingStaff(obj.supportingStaff)}
                      <tr key={"DeleteButton"+index}><td></td><td>
                      <input type="button" className="button1 button2"
                      onClick={deleteDoc.bind(null,index)}
                      value="Delete Entry"></input>
                      </td></tr>
                      </tbody>
                     );
            return list;
        },[]);

    }
    
    instance.render = function(){

        if(instance.props.workingStatus!="Working"){
            return (<div></div>)
        }
        
        return (
                <div className="lsas">
                <table >
                {getDetails()}
                <tbody >
                <tr><td><input type="button" className="button1 button2" onClick={addDoctor} value="Add Doctor"></input></td></tr>
                </tbody>
            </table>
            </div>
        )
    }
    return instance;

}
