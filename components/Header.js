import React,{propTypes} from 'react';
import cache from '../localstorage';

export function Header(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;
    function reset(){
        cache.reset();
        state.curr_view="login";
        state.changeView(state);
    }
    
    instance.render = function(){
        
        
        return (
                <div className="headerDiv">
                <table className="headerTable">
                <tbody>
                <tr>
                <td className="userAndFacility"> {state.curr_user_data.user.displayName}</td>
                
            </tr>
                <tr>
                <td className="userAndFacility"> {state.curr_user_data.user.organisationUnits[0].name}</td>
                </tr>
                </tbody>
                </table>
              <input className="headerSettings" type="button" onClick = {reset} value="Reset"></input>
            </div>

        )
    }
    
    return instance;
}
