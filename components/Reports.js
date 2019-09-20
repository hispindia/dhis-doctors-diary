import React,{propTypes} from 'react';
import moment from 'moment';
import constants from '../constants';

export function Reports(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    function back(){
        state.curr_view=constants.views.calendar;
        state.changeView(state);
    }
    
    var state = props.state;
    instance.render = function(){
        return (
              <div>

                <div className="">

                <table className="tableDiv">
                <tbody>
                <tr>
                    <td>
                        <button className="settingsButton" onClick={back}>Back</button>
                    </td>
                </tr>
              
           
                </tbody>
                </table>

            Report Come Here #TODO

            </div>
                </div>
        )
    }
    return instance;
}
