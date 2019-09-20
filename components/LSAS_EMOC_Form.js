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
        data : [
            {
                id : "asdasd",
                onCall : false,
                supportingStaff : []
            }
        ]        
    };

    function addDoctor(){
        state.data.push( {
                id : "asdasd",
                onCall : false,
                supportingStaff : []
        });
        instance.setState(state);

    }
    function addSupportStaff(staff,e){
        var val = e.target.parentElement.children[0].value;
        staff.push(val);
        instance.setState(state);
        
    }
    function getDetails(){

        function getSupportingStaff(staff){
            
            var addButton = (<tr><td>
                             <input type="text" defaultValue="" ></input>
                             <input type="button" onClick={addSupportStaff.bind(null,staff)} value="Add Staff"></input>
                             </td></tr>);
            
            if (staff.length == 0){
                return addButton;
            }
            
            var ids = staff.reduce(function(list,obj,index){
                list.push(<tr><td>Staff{index+1}</td><td>{obj}</td></tr>);
                return list;
            },[]);

            ids.push(addButton);
            
            return ids;
        }
        
        return state.data.reduce(function(list,obj){
            
            list.push(<tbody>
                     <tr>
                     <td>
                      Doctor Id : <input type="text" value={obj.id}></input>
                     </td>
                     </tr>
                     <tr>
                     <td>On Call?</td>
                    <td> <select value={obj.onCall}>
                     <option value="true">yes</option>
                     <option value="false">No</option>
                     </select>
                     </td>
                     </tr>
                     
                     {getSupportingStaff(obj.supportingStaff)}
                     </tbody>
                     );
            return list;
        },[]);

    }
    
    instance.render = function(){
        return (
                <div className="lsas">
                <table>
                {getDetails()}
                <tr><td><input type="button" onClick={addDoctor} value="Add Doctor"></input></td></tr>
            </table>
            </div>
        )
    }
    return instance;

}
