import React,{propTypes} from 'react';
import cache from '../localstorage';
import constants from '../constants';

export function LeftbarSettings(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;

    instance.render = function(){

        return(
                <div>
                <div className="">
                
                <label className="floatLeft"></label>
                <table className="">
                <tbody>
                <tr>
                <td>
                <input className="" type="button" onClick = {changePassword} value="Change Password"></input>
                </td>
                </tr>
                
                <tr>
                <td>
                <input className="" type="button" onClick = {changeProfile} value="My Profile"></input>
                </td>
                </tr>
                
                <tr>
                <td>
                <input className="" type="button" onClick = {logout} value="Log Out"></input>
                </td>
                </tr>
                </tbody>
                </table>
                <br></br>
                <br></br>

                <label className=""></label>
                <table className="">
                <tbody>
                
                <tr>
                <td >
                <input className=" red"  type="button" onClick = {reset} value="Reset"></input>
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
