import React,{propTypes} from 'react';
import dhis2API from '../lib/dhis2API'
import XLSX from 'xlsx-populate';

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
        document.location.reload()
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

    function getReportData(key,callback){
        var dsServiceData = new dhis2API.dataStoreService('XLReport_Data');
        dsServiceData.getValue(key).then(function(data){
            callback(data)
        });
    }
    
    function downloadExcel(obj,index,e){

        getReportData(obj.key,function(data){
            var fullName = "excelTemplate.xlsx"
            XLSX.fromDataAsync(data.excelTemplate,{base64:true}).then(function(wb){
                wb.outputAsync().then(function(blob){
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob, fullName);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = fullName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }
                });
            });            
        });
    }

    function downloadMapping(obj,index,e){
        
        getReportData(obj.key,function(data){
            downloadObjectAsJson(data.mapping,obj.name+"_mapping");
        });        
    }
    
    function downloadObjectAsJson(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
    
    function getRows(){
        var rows = state.reports.reduce((list,obj,index)=>{

            list.push(<tr className={index%2==0?'listRow':'listAlternateRow'} >
                      <td>{index+1}</td>
                      <td><input type="button" value="Edit" onClick={edit.bind(null,obj.key)}></input></td>
                      <td>{obj.name}</td>
                      <td>{obj.description}</td>
                      <td>{obj.reportType}</td>
                      <td>{obj.periodType}</td>
                      <td>{obj.orgUnitLevel}</td>
                      <td><a href="javascript:void(0);" onClick={downloadExcel.bind(null,obj,index)} >{"excel"} </a></td>
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
                <table className="listTable">
            <thead>
            <tr>
                <th>#</th><th></th>
                <th>Name</th>
                <th>Description</th>
                <th>ReportType</th>
                <th>Period Type</th>
                <th>Org Unit Level</th>
                <th>Excel Template</th>
                <th>Mapping File</th>
                <th></th>
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
