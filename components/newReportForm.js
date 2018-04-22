import React,{propTypes} from 'react';
import dhis2API from '../lib/dhis2API'

export function UploadFile(props){

    function encodeFileAsURL(){}
    return (
            <div>
            <input type="file" id={props.id} onChange={encodeFileAsURL(this)}/>
            </div>
    )
}

export function NewReportForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;   

    var state = {
        report : null
    }

    function init(){
        var key = "";
        
        var dsServiceMeta = new dhis2API.dataStoreService('XLReports_Metdata');
        var dsServiceData = new dhis2API.dataStoreService('XLReports_Data');

        var Preports = dsService.getAllKeyValues();
        Promise.all([Preports]).then(function(values){
            var reports = values[0];        
            state.reports = reports;
            instance.setState(Object.assign({},state));
        })
    }

    // init();

    state = {
        metadata : {
            name : "",
            key : "XLReport_"+Math.random(1),
            description : "",
            periodType : "",
            reportType : "",
            orgUnitLevel : "",
            excelTemplate : {
                name : "",
                size : ""                   
            },
            lastUpdatedBy : ""
        },
        data : {
            excelTemplate : null,
            mapping : {
                sheetName : "",
                pivotStartColumn : "",
                pivotStartRow :"",
                pivotEndRow : "",
                periodCell  : "",
                facilityCell:"",
                decoc : [],
                calc : []
            }
        }
    }

    
    function handleSubmit(event){
        event.preventDefault();debugger
      

        var fileService = require('../utility-fileOps');
        var userService = new dhis2API.userService();
    
        
        var excelP = fileService.loadExcelFiled(event.target.elements.excelFile.files[0]);
        var jsonP = fileService.loadJsonFile(event.target.elements.jsonFile.files[0])
        var currentUserP = userService.getCurrentUser("id,name");


        Promise.all([excelP,jsonP,currentUserP]).then(function(values){

            var metdata = {
                name : event.target.elements.name.value,
                key : event.target.elements.key.value,
                description : event.target.elements.description.value,
                periodType : event.target.elements.periodType.selectedOptions[0].value,
                reportType : event.target.elements.reportType.selectedOptions[0].value,
                orgUnitLevel : event.target.elements.orgUnitLevel.value,
                excelTemplate : {
                    name : event.target.elements.excelFile.files[0].name,
                    size : event.target.elements.excelFile.files[0].size                   
                },
                lastUpdatedBy : values[2]
            }
            
            var data = {
                key :  metadata.key,
                excelTemplate :values[0],
                mapping : values[1]               
            }
            
        
            var dsServiceMetdata = new dhis2API.dataStoreService("XLReport_Metadata");
            var dsServiceData = new dhis2API.dataStoreService("XLReport_Data");
            
            dsServiceMetdata.saveOrUpdate(metdata,function(error,response,body){
                
            });
            dsServiceMetdata.saveOrUpdate(data,function(error,response,body){
                
            });
            
            debugger
        })
    
        
    }
    
     function getDecocRows(){

        if (state.data.mapping.decoc.length == 0){
            return (<tr><td>
                    <select key="initialDe" ></select></td></tr>
                   )
        }
         
        var decoc = state.decoc.reduce((list,obj) => {
            
        },[])

        
    }
    
    instance.render = function(){
    
        return (            
                <form onSubmit={handleSubmit} >
                <table>
                <tbody>
                <tr>
                <td> Key: <input disabled id="key" value={state.metadata.key} type="text"></input></td></tr>
                <tr>
                <td>Name : </td><td><input id="name" value={state.metadata.name} type="text"></input></td>
                </tr>
                <tr>
                <td>Description : </td><td><input id="description" type="text" value={state.metadata.description} ></input></td>
                </tr>
                <tr>
                <td>Period Type : </td><td><select id="periodType" value={state.metadata.periodType}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option></select></td>
                </tr>
                <tr><td>Report Type: <select id="reportType" value={state.metadata.reportType}>
                <option value="OUWiseProgressive">OUWiseProgressive</option>
                <option value="PeriodWiseProgressive">PeriodWiseProgressive</option></select></td></tr>

                <tr>
                <td>Org Unit Level : </td><td><input type="number" id="orgUnitLevel" value={state.metadata.orgUnitLevel}></input></td>
                </tr>
                <tr>
                <td>Upload Excel Template </td><td><UploadFile id="excelFile"/></td>
                </tr>
                <tr>
                <td>Upload Mapping File : </td><td><UploadFile id="jsonFile" /></td>
                </tr>
                
            </tbody>
                </table>

          <div>

            <h3> Mapping </h3>
            <table key="conf">
                <tbody>
                <tr><td>Sheet Name: <input type="text" value={state.data.mapping.sheetName}></input></td></tr>
                <tr><td>Start Column: <input type="text" value={state.data.sheetName}></input></td></tr>
                <tr><td>Start Row: <input type="text" value={state.data.pivotStartRow}></input></td></tr>
                <tr><td>End Row: <input type="text" value={state.data.pivotEndRow}></input></td></tr>
                <tr><td>Period Cell: <input type="text" value={state.data.periodCell}></input></td></tr>
                <tr><td>Facility Cell: <input type="text" value={state.data.facilityCell}></input></td></tr>
            </tbody>
            </table>
                <h3> Decoc </h3>
                <table key="decoc">
                <thead>
                <tr><th>Data Element </th><th>CategoryOptionCombo</th><th>Org Unit Groups</th><th>Row</th><th>Column</th></tr>
                </thead>
                <tbody>
                {getDecocRows()}
            </tbody>
            </table>
            
            
            </div>
                <input type="submit"  value="Save"></input>
                </form>
        )
    }

    return instance;
}
