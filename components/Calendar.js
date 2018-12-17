import React,{propTypes} from 'react';
import cache from '../localstorage';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import constants from '../constants';

const moment = extendMoment(Moment);

const splitToChunks = function(array, parts) {
    let result = [[]];
    parts = parts -1;

    for (let i = 0,j=0,k=0; i < array.length; i++) {
        result[j][k] = array[i];
        if (k%parts == 0 && k!=0 && i< array.length-1){
            j=j+1;
            result[j] = [];
            k=-1;
        }
        k=k+1;
    }
    return result;
}

export function Calendar(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;

    function makeDateRange(){

        var selMonthFirstDayIndex = parseInt(state.selMoment.startOf('month').format('d'));
        var selMonthLastDay = moment(state.selMoment).endOf('month');
        var selMonthLastDayIndex = parseInt(state.selMoment.endOf('month').format('d'));
        var prevMonthLastDay = moment(state.selMoment).subtract(1, 'months').endOf('month');
        

        var prefixDayLastMonth = moment(prevMonthLastDay).subtract((6 - (7-(selMonthFirstDayIndex-1))),'days');
        var suffixDayNextMonth = moment(selMonthLastDay).add((7 - selMonthLastDayIndex),'days');
        
        var start = prefixDayLastMonth
        , end   = suffixDayNextMonth
        , range = moment().range(start, end);

        return Array.from(range.by('days'))
    }

    function getDates(){
           
        state.currRange = makeDateRange();
        state.currRange = splitToChunks(state.currRange,7)

        return state.currRange.map(function(row){

            return (<tr key = {row[1].toString()} >{
                row.map(function(cell){
                    return getDateCell(cell);
                })
            }</tr>)
        })

        function getDateCell(date){
            
            var event = instance.props.state.curr_user_eventMapByDate[date.format('YYYY-MM-DD')];
            
            return (<td key = {date.format('YYYY-MM-DD')} onClick={goToDataEntry.bind(null,event)} >{date.format('D')}</td>)  
        }
    }

    function goToDataEntry(event){
        state.curr_view = constants.views.entry;
        state.curr_event = event;
        state.changeView(state);
        
    }
    
    function prevMonth(){
        state.selMoment = moment(state.selMoment).subtract(1,'month');
        instance.setState(state)
    }

    function nextMonth(){
        state.selMoment = moment(state.selMoment).add(1,'month');
        instance.setState(state)
    }
    
    instance.render = function(){
         return (
                 <div>
                 <label>{state.selMoment.format('MMM') +' '+ state.selMoment.format('YYYY')}</label>
                 <div onClick = {prevMonth}><b>&lt;</b></div>
                 <div onClick = {nextMonth} ><b>&gt;</b></div>
                 <table>
                 <thead>
                 
                 <tr>
                 <th>M</th>
                 <th>T</th>
                 <th>W</th>
                 <th>T</th>
                 <th>F</th>
                 <th>S</th>
                 <th>S</th>
                 </tr>
                 </thead>
                 <tbody>
                 {getDates()}
                 </tbody>
                 </table>
             </div>
         )
    }
    return instance;
}
