import React,{propTypes} from 'react';
import cache from '../localstorage';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export function DataEntryForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;

    instance.render = function(){
         return (
                 <div>
                 {state.program_metadata.name}
                 </div>
         )
    }
    return instance;

    function createForm(){
        
    }

    function createQuestion(de){
     

    }
}
