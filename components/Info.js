import React,{propTypes} from 'react';
import cache from '../localstorage';
import constants from '../constants';


export function Info(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;

    var ps = state.
        program_metadata_programStageByIdMap[state.
        curr_user_program_stage];

    function getUserInfo(){
        if(ps.name.includes("LSAS") || ps.name.includes("EmOC") )
        {

            return (<iframe src="./images/user_guide.pdf" className="pdf"/>);
        }
        else{
            return (<img className="imgDiv" src="./images/manual.jpg"></img>);
        }
    }

    instance.render = function(){

        return(
                <div>
                    <button className="button1 button2" onClick={back}>Back</button>
                <div className="infoArea">

                <table className="tableDiv">
                <tbody>

                <tr>
                    <td >
                        {getUserInfo()}

                    </td>
                </tr>
           
                </tbody>
                </table>

                </div>
                </div>
                
        )
    }

    function back(){
        state.curr_view=constants.views.calendar;
        state.changeView(state);
        
    }
    
    function reset(){
        cache.reset();
        state.curr_view=constants.views.login;
        state.changeView(state);
    }

    function logout(){
        state.curr_view=constants.views.login;
        cache.save(constants.cache_curr_user,null);
        state.changeView(state);
        
    }

    function changeProfile(){
        state.curr_view=constants.views.profile;
        state.changeView(state);
        
    }

    function changePassword(){
        state.curr_view=constants.views.changePassword;
        state.changeView(state);
        
    }

    return instance;
}
