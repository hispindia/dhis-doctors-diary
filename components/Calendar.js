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
                    return getDateCell(cell,state.selMoment);
                })
            }</tr>)
        })

        function getDateCell(date,refDate){
            
            var event = instance.props.state.curr_user_eventMapByDate[date.format('YYYY-MM-DD')];
            
            var className = getClass(date,refDate,event);
            var img = getImage(event);
            return (<td className={className}
                    key = {date.format('YYYY-MM-DD')}
                    onClick={goToDataEntry.bind(null,event,date.format("YYYY-MM-DD"),className)} >
                    <div className="cellDiv">
                    {date.format('D')}
                    <img className="tick" src={img}></img>
                    </div>
                    </td>
                   )  
        }
    }

    function getClass(date,refDate,event){
        var className = "calendarTableCell"; 
        if(!date.isSame(refDate,'month')){
            className=className +" fringeDays";
        }else{
            className=className + " thisMonth";
        }
        
        if (date.isAfter(moment().subtract(1,'week')) &&
            date.isBefore(moment().add(1,'days'))){
            className = className + " entryDate";
        }

        if(date.isAfter(moment().add(1,'days'))){
            className=className + " futureDate";
        }

     
        
        
        return className;
    }

    function getImage(event){
        
        if (event){
            if (event.offline){

                return constants.images.offline
            }else{
                return constants.images.sent
                
            }
        }else{
            
        }

        return constants.images.white;
    }
    
    function goToDataEntry(event,date,className){

        if (className.includes("futureDate")){
            return;
        }
        
        state.curr_view = constants.views.entry;
        state.curr_event = event;
        state.curr_event_date = date;
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
                 <div className="calendarArea">
                 <div className="calendarButton">
                 <div className="floatLeft"  onClick = {prevMonth}><b>&lt;</b></div>

                 <label>{state.selMoment.format('MMM') +' '+ state.selMoment.format('YYYY')}</label>
                 <div className="floatRight" onClick = {nextMonth} ><b>&gt;</b></div>
                 </div>
                 <table className="calendarTable">
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
