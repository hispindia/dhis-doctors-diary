import React,{propTypes} from 'react';
import cache from '../localstorage';
import moment from 'moment';
import constants from '../constants';
import sync from '../sync-manager';
import utility from '../utility';

export function LSAS_EMOC_Form(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    
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
                             <input type="text" defaultValue="" ></input>
                          
                             <input type="button" onClick={addSupportStaff.bind(null,staff)} value="Add Staff"></input>
                             </td></tr>);
            
            if (staff.length == 0){
                return addButton;
            }
            
            var ids = staff.reduce(function(list,obj,index,staff){
                list.push(<tr key={obj + index}>
                          <td>Staff{index+1}   <input type="button"
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
            
            list.push(<tbody key={obj.id + index}>
                      <tr key={"DocId"+obj.id + index}>
                     <td>
                      Doctor Id : </td>
                      <td><input type="text" value={obj.id} onChange={idChange.bind(null,obj)}></input>
                     </td>
                     </tr>
                     <tr key={"onCall"+obj.id + index}>
                     <td>On Call?</td>
                      <td> <select value={obj.onCall} onChange={onCallChange.bind(null,obj)}>
                     <option value="true">yes</option>
                     <option value="false">No</option>
                     </select>
                     </td>
                     </tr>
                     
                      {getSupportingStaff(obj.supportingStaff)}
                      <tr key={"DeleteButton"+obj.id}><td></td><td>
                      <input type="button"
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
                <table>
                {getDetails()}
                <tbody>
                <tr><td><input type="button" onClick={addDoctor} value="Add Doctor"></input></td></tr>
                </tbody>
            </table>
            </div>
        )
    }
    return instance;

}
