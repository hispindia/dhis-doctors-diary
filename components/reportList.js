import React,{propTypes} from 'react';
import dhis2API from '../lib/dhis2API'

export function ReportList(){
  
    var instance = Object.create(React.Component.prototype)

    var state = {
        reports : []
    };
    
    function init(){
        var dsService = new dhis2API.dataStoreService('XLReports');

        var Preports = dsService.getAllKeyValues();
        Promise.all([Preports]).then(function(values){
            var reports = values[0];        
            state.reports = reports;
            instance.setState(Object.assign({},state));
        })
    }
    init();

    function edit(reportKey){
        window.location.href = window.location.href+"/"+reportKey;        
   
    }

    function remove(reportKey){

    
    }

    
    function getRows(){
        var rows = state.reports.reduce((list,obj,index)=>{

            list.push(<tr>
                      <td>{index+1}</td>
                      <td><input type="button" value="Edit" onClick={edit.bind(null,obj.key)}></input></td>
                      <td>{obj.name}</td>
                      <td>{obj.description}</td>
                      <td>{obj.periodType}</td>
                      <td>{obj.orgUnitLevel}</td>
                      <td>Excel</td>
                      <td>mapping</td>
                      <td><input type="button" value="Remove" onClick={remove.bind(null,obj.key)}></input></td>
                      </tr>);
            return list;
        },[])

        return rows;
    }

    
    
    instance.render = function(){
        return (
                <div >
            <table>
            <thead>
            <tr>
            <th>#</th><th></th><th>Name</th><th>Description</th><th>Period Type</th><th>Org Unit Level</th><th>Excel Template</th><th>Mapping File</th><th></th>
            </tr>
            </thead>
            <tbody>
                {getRows()}
            </tbody>
        
        </table>
        
            </div>
        )
    }

    return instance;
}
