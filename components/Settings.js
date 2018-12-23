import React,{propTypes} from 'react';
import cache from '../localstorage';
import constants from '../constants';

export function Settings(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;

    instance.render = function(){

        return(
            <div className="calendarArea">

              <table className="calendarTable">
                <tbody>
                  <tr>
                    <td>
                      <input className="settingsButton" type="button" onClick = {back} value="Back"></input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input className="settingsButton" type="button" onClick = {logout} value="Log Out"></input>
                    </td>
                  </tr>
                  <tr>
                    <td >
                      <input className="settingsButton red"  type="button" onClick = {reset} value="Reset"></input>
                    </td>
                  </tr>
                  
                </tbody>
              </table>
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
        state.changeView(state);
   
    }
    return instance;
}
