import React,{propTypes} from 'react';
import dhis2API from '../lib/dhis2API'

export function ReportList(){
  
    var instance = Object.create(React.Component.prototype)

    var state = {
        reports : []
    };
    
    function init(){
        var dsServiceMetadata = new dhis2API.dataStoreService('XLReport_Metadata');

        var Preports = dsServiceMetadata.getAllKeyValues();
        Promise.all([Preports]).then(function(values){
            var reports = values[0];        
            state.reports = reports;
            instance.setState(Object.assign({},state));
        })
    }
    init();

    function edit(reportKey){
        window.location.href = window.location.href+"/edit/"+reportKey;        
    }
    
    function add(){
        window.location.href = window.location.href+"/add";        
    }

    function refresh(){
        window.location.href = window.location.href;            
    }
    
    function remove(reportKey){
        
        if (!confirm("Are you sure?")){
            return;
        }
        
        var dsServiceMetadata = new dhis2API.dataStoreService('XLReport_Metadata');
        var dsServiceData = new dhis2API.dataStoreService('XLReport_Data');

        dsServiceMetadata.remove(reportKey,function(error,response,body){
            if (error){
                console.log("Not able to delete"+error)
                return
            }
            
            dsServiceData.remove(reportKey,function(error,response,body){
                if (error){
                    console.log("Not able to delete"+error)
                    return
                }

                refresh();
            })
        })
    
    }

    function downloadExcel(obj,index,e){

        if (obj.excelTemplate){

        }else{
            var dsServiceData = new dhis2API.dataStoreService('XLReport_Data');
            
        }
        debugger
    }

    function downloadMapping(obj,index,e){
        debugger
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
                      <td><a href="javascript:void(0);" onClick={downloadExcel.bind(null,obj,index)} >Download Template </a></td>
                      <td><a href="javascript:void(0);" onClick={downloadMapping.bind(null,obj,index)} >Download Mapping </a></td>
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
                <input type="button" value="Add" onClick={add}></input>
            </div>
        )
    }

    return instance;
}
