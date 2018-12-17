import React,{propTypes} from 'react';
import cache from '../localstorage';
import moment from 'moment';

const dayNameMapping = {
    'Monday' : 0,
    'Tuesday' : 1,
    'Wednesday' : 2,
    'Thursday' : 3,
    'Friday' : 4,
    'Saturday' : 5,
    'Sunday' : 6
}

export function Calendar(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = {
        selMoment : moment()
    }
    
    function getDates(){

       
        var dateList = [];
        var selMonthFirstDayIndex = parseInt(state.selMoment.startOf('month').format('d'));
        var selMonthLastDay = parseInt(state.selMoment.endOf('month').format('D'));
        var prevMonthLastDay = parseInt(state.selMoment.subtract(1, 'months').endOf('month').format('D'));

        var start = new Date(2012, 0, 15)
  , end   = new Date(2012, 4, 23)
  , range = moment().range(start, end);

        dateList.push(getfirstWeekDates());
        dateList.push(getPostFirstWeekDates());

        function getfirstWeekDates(){
            let list = [];
            for (var i=0,j=prevMonthLastDay - (6 - (7-(selMonthFirstDayIndex-1))); i < 7;i++,j++)
            {
                if (j > prevMonthLastDay){
                    j=1;
                }
                console.log(j);
                list.push(getDateCell(j));
            }
            return (<tr>{list}</tr>);
        }

        function getPostFirstWeekDates(){
            let list = [];
            
            for (var i=0,j=selMonthFirstDayIndex; j < selMonthLastDay;  i++,j++){
                console.log(j+1);
                if (j%7 == 0){
                //    list.push(getDateCellRowEnd(i+1));
                }else{
                    list.push(getDateCell(i+1));
                }
            }
            
            return list;
            
        }
        
        function getDateCell(j){

            return  (<td>{j}</td>)            
        }

    

        
        return dateList;
    }






    
    instance.render = function(){
         return (
                 <div>
                 <label>{state.selMoment.format('MMM') +' '+ state.selMoment.format('YYYY')}</label>
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
