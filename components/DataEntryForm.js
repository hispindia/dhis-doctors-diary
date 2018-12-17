import React,{propTypes} from 'react';
import cache from '../localstorage';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export function DataEntryForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = {
        selMoment : moment(),
        currRange : null
    }

    instance.render = function(){
         return (
                 <div>
                 sadfsafd
             </div>
         )
    }
    return instance;
}
