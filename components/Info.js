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
                        <img className="imgDiv" src="./images/doublegreentick.png"></img>

                        <h6>Data is Approved</h6>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img className="imgDiv" src="./images/greenyellowtick.png"></img>

                        <h6>Data not send</h6>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img className="imgDiv" src="./images/greytick.png"></img>
                        <h6>Offline Data Save</h6>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img className="imgDiv" src="./images/rejected.png"></img>

                        <h6>Data is Rejected</h6>
                    </td>
                </tr>
                <tr>
                    <td >
                        <div className="div1"></div>
                        <h6> Data is completed</h6>
                    </td>
                </tr>

                <tr>
                    <td>

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
