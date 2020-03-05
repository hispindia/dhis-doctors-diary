import React,{propTypes} from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import constants from '../constants';
import utility from '../utility';
import cache from "../localstorage";

const moment = extendMoment(Moment);


export function Calendar(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;
    var ps = state.
        program_metadata_programStageByIdMap[state.
        curr_user_program_stage];

    function makeDateRange(){

        var selMonthLastDay = moment(state.selMoment).endOf('month');
        var selMonthLastDayIndex = parseInt(state.selMoment.endOf('month').format('d'));
        var prevMonthLastDay = moment(state.selMoment).subtract(1, 'months').endOf('month');

        var prefixDayLastMonth = moment(prevMonthLastDay).day("Monday");
        var suffixDayNextMonth = moment(selMonthLastDay).add((7 - selMonthLastDayIndex),'days');
        
        var start = prefixDayLastMonth
        , end   = suffixDayNextMonth
        , range = moment().range(start, end);

        return Array.from(range.by('days'))
    }

    function getDates(){
           
        state.currRange = makeDateRange();
        state.currRange = constants.splitToChunks(state.currRange,7)

        return state.currRange.map(function(row){

            return (<tr key = {row[1].toString()} >{
                row.map(function(cell){
                    return getDateCell(cell,state.selMoment);
                })
            }</tr>)
        })

        function getDateCell(date,refDate){
            console.log(state.loading)
            var event = instance.props.state.curr_user_eventMapByDate[date.format('YYYY-MM-DD')];
            
            var className = getClass(date,refDate,event);
          //  var img = getImage(event);
            return (<td className={className}
                    key = {date.format('YYYY-MM-DD')}

                    onClick={goToDataEntry.bind(null,event,date.format("YYYY-MM-DD"),className)} >
                    <div className="cellDiv">
                    {date.format('D')}
                    {getImage(event)}
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
        
        if (date.isAfter(moment("2019-04-01")) &&
            date.isBefore(moment().add(1,'days'))){
            className = className + " entryDate";
        }

        if(date.isAfter(moment().add(1,'days'))){
            className=className + " futureDate";
        }

        if (event && event.status && event.status == "COMPLETED"){
            className=className + " completedDate";
        
        }
     
        
        return className;
    }

    function getImage(event){
        var imgUrl = "";
        if (event){
            if (event.offline){
                imgUrl = "./images/greytick.png"
            }else{
                
                var dataValueMap = event.dataValues.
                    reduce(function(map,obj){
                        map[obj.dataElement] = obj.value;
                        return map;
                    },[]);
        
                switch(dataValueMap[constants.approval_status_de]){
                case "Auto-Approved" :
                case "Approved" :
                    if (event.status=="COMPLETED"){
                        imgUrl = "./images/doublegreentick.png";
                    
                    }else {

                        imgUrl = "./images/greentick.png";    
                    }
                    break;
                case "Re-submitted":
                case "Rejected" : imgUrl = "./images/rejected.png";
                    break;
                case constants.approval_status.pendingCMO:
                case constants.approval_status.pendingMOIC:
                case undefined :

                    if (event.status=="COMPLETED"){
                        
                        imgUrl = "./images/greenyellowtick.png";
                    }else {
                        
                        imgUrl = "./images/greentick.png";    
                    }
                    break;
                }                
            }

            return(<img className="tick" src={imgUrl}></img> )
        }else{
            return (<img className="tick" ></img>)
        
        }
        
    }
    function reset(){
        cache.reset();
        state.curr_view=constants.views.login;
        state.changeView(state);
    }
    function goToDataEntry(event,date,className){

        if (className.includes("futureDate")){
            return;
        }
        
        state.curr_view = constants.views.entry;
        state.curr_event = event;
        state.curr_event_date = date;
        state.curr_event_calendar_classname = className;

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
    var error;

    if (!ps){
        //alert("Stage not assigned to user");
        error = "User does not have access to any form.";
    }

    instance.render = function(){
        try{
            return (<div>
                    <div className="big calendarFacility">{utility.makeFacilityStrBelowLevel(state.curr_user_data.user.organisationUnits[0],2)}</div>

                    <div className="calendarArea">

                        <div className="calendarButton">
                            <div className="floatLeft big "  onClick = {prevMonth}><b>&lt;&lt;</b></div>


                            <div className="big">{state.selMoment.format('MMM') +' '+ state.selMoment.format('YYYY')}</div>
                            <div className="floatRight big " onClick = {nextMonth} ><b> &gt;&gt; </b></div>
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
                    </div></div>
            )
        }
        catch (error) {
            return (<div className="calendarArea">
                <h1>Cache issue</h1>
                Clear Cache<input className="settingBt" type="button" onClick = {reset} value="Reset"></input>
                {error}
            </div>)
        }
    }
    return instance;
}
