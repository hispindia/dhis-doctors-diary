import React,{propTypes} from 'react';
import cache from '../localstorage';
import constants from '../constants';


export function Info(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;

    instance.render = function(){

        return(
                <div>

                <div className="calendarArea">

                <table className="tableDiv">
                <tbody>
                <tr>
                    <td>
                        <button className="settingsButton" onClick={back}>Back</button>
                    </td>
                </tr>
                <tr>
                    <td >
                        <img className="imgDiv" src="./images/manual.jpg"></img>

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
