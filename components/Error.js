import React,{propTypes} from 'react';
import cache from "../localstorage";
import constants from "../constants";

export function Error(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var state = props.state;

    function reset(){
        cache.reset();
        state.curr_view=constants.views.login;
        state.changeView(state);
    }
    instance.render = function(){
  
        return (
            <div className="calendarArea">
                <h2>Previous Cache Found</h2>
                <br/><br/>
                <p>Please click on "Clear Cache" button to clean cache</p>
                <input className="settingBt" type="button" onClick = {reset} value="Clear Cache"></input>
            </div>
        )
    }
    
    return instance;
}
