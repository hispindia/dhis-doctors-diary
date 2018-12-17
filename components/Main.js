import React,{propTypes} from 'react';
import constants from '../constants';
import cache from '../localstorage';

import {Login} from './Login'
import {Calendar} from './Calendar'
import {DataEntryForm} from './DataEntryForm'
import {Loader} from './Loader'

export function Main(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var state = props.state;

    state.changeView = function(state){
        instance.setState(state);
    }
    instance.render = function(){

        switch(state.curr_view){
        case constants.views.login :
            return (<div>
                    <Login state={state}/>

                    </div>
                   );
        case constants.views.calendar :
            return (<div>
                    <Calendar state={state}/>
                    
                    </div>
                   );
        case constants.views.entry :
            return (<div>
                    <DataEntryForm state={state}/>

                    </div>
                   );
        case constants.views.loader :
            return (<div>
                    <Loader props={state}/>
                    
                    </div>
                   );
            
        default :
            return (<div>
                    <Loader props={state}/>

                    </div>
                   );
            

        }
    }
    return instance;

  
}
