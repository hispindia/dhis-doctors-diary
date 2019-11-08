import React,{propTypes} from 'react';
import constants from '../constants';
import cache from '../localstorage';


import moment from 'moment';

let currentDate = new Date();
export function Reports(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var dirtyBit = true;
    var state = props.state;


    var ps = state.
        program_metadata_programStageByIdMap[state.
        curr_user_program_stage];


    var dataElementList = [];
    var dataMap = [];
    var dateList =[];

    function currentView(){
        dirtyBit = false;
        state.curr_view=constants.views.reports;
        state.changeView(state);
    }
    function back(){
        state.curr_view=constants.views.calendar;
        state.changeView(state);
    }
    function getUserDataElement() {
        //console.log(ps.programStageDataElements);
        dataElementList = [];
        return Object.assign([],ps.programStageDataElements)
            .reduce(function(list,obj){
                if (obj.dataElement.id === constants.lsas_emoc_data_de || obj.dataElement.id === constants.emoc_data_de) {
                    //console.log(obj.dataElement.id);
                }
                else{
                    list.push(<th>{obj.dataElement.formName}</th>);
                    dataElementList.push(obj.dataElement.id);
                }
                return list;
            },[]);


    }
function  createTable() {
        var table = [];
    var count = 0;
    dataMap = [];
    dateList =[];
    state.curr_user_data = cache.get(constants.cache_user_prefix+state.curr_user.username);

    state.curr_user_data.events.reduce(function(list,obj) {
            var edate = new Date(obj.eventDate);
            if (edate.getMonth() == currentDate.getMonth()) {
                count++;
                list[moment(obj.eventDate).format("YYYY-MM-DD")]= obj;
                dataMap[edate] = obj;
                dateList.push(edate);
            }

            return list;
        },[]);

    if(dataMap != null && dateList != null)
    {
        dateList.sort((a,b)=>a.getTime()-b.getTime());
        for (var i = 0; i < dateList.length; i++) {
            var children = [];
            var evdate = dateList[i].toLocaleDateString("en-GB") ;
            children.push(<td>{evdate}</td>);
            children.push(<td>{dataMap[dateList[i]].status}</td>);
            if(dataMap[dateList[i]].dataValues.length > 0) {
                var d1 = dataMap[dateList[i]].dataValues;
                if(dataElementList.length != 0){
                    for (var j = 0; j < dataElementList.length; j++) {
                        var dE = "";
                           for(var k = 0; k < d1.length; k++){
                            if(d1[k].dataElement === dataElementList[j])
                            {
                                dE = d1[k].value;
                            }
                           }
                       if(dE != "" )
                       {
                           children.push(<td>{dE}</td>);
                       }
                       else{
                           children.push(<td> </td>);
                       }
                    }
                }

            }
            table.push(<tr>{children}</tr>)
        }
    }
    return table;
}


    var state = props.state;
    instance.render = function(){
        return (<div className="reportArea">
                <table className="reportTable">
                <thead>
                <tr>
                    <th colSpan="8">User Report of Current Month</th>
                </tr>
                <tr>
                    <th>Event Date</th>
                    <th>Data Status</th>
                    {getUserDataElement()}
                </tr>
                </thead>
                <tbody>
                    {createTable()}
                </tbody>
            </table></div>
        )
    }
    return instance;
}
