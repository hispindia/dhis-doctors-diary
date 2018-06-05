import React,{propTypes} from 'react';
import dhis2API from '../lib/dhis2API'

export function NewReportForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var decocRow = {
        de : "-1",
        coc :"-1",
        row: "-1",
        ougroup : "nogroup"
      }

    var calcRow = {
        expression : ""
    }
    
    var state = {
        metadata : {
            name : "",
            key : "XLReport_"+Math.floor(Math.random(1)*100000),
            description : "",
            periodType : "monthly",
            reportType : "OUWiseProgressive",
            orgUnitLevel : "-1",         
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
                decoc : [
                    Object.assign({},decocRow)
                ],                
                calc : [
                    Object.assign({},calcRow)
                ]
            }
        }
    }

    function init(){

        var reportKey = "";
        if (window.location.hash.startsWith("#/reports/add")){
            
        }else if (window.location.hash.startsWith("#/reports/edit")){
            reportKey = window.location.hash.split("#/reports/edit/")[1];
        }
     
        
        var dsServiceMeta = new dhis2API.dataStoreService('XLReports_Metdata');
        var dsServiceData = new dhis2API.dataStoreService('XLReports_Data');

        var PreportMetadata = dsServiceMeta.getValue(reportKey);
        var PreportData = dsServiceData.getValue(reportKey);
        
        var mdService = new dhis2API.metadataService();
        var deP = mdService.getObj("dataElements?paging=false&fields=id,name,categoryCombo[id,name,categoryOptionCombos[id,name]]");
        var ougP = mdService.getObj("organisationUnitGroups?paging=false&fields=id,name");
        
        Promise.all([deP,ougP,PreportMetadata,PreportData]).then(values => {
            
            var des = values[0].dataElements;
            var ougs = values[1].organisationUnitGroups;        
            state.init.des = des;
            state.init.ougs = ougs;

            state.init.deMap = des.reduce((map,obj)=>{
                map[obj.id] = obj;
                return map;
            },[])

            
            instance.setState(Object.assign({},state));
        })
    }

     init();

  
    function validate(){
        
        if (!state.metadata.name){
            alert("name missing")
            return false;
        }

        if (!state.data.excelTemplate){
            alert("Please upload excel template")
            return false;
        }
   
   
        return true;
    }
    
    function handleSubmit(event){
        event.preventDefault();
   
        if (!validate()){
            return
        }
        
        var fileService = require('../utility-fileOps');
        var userService = new dhis2API.userService();
    
        if (state.data.mapping instanceof File){
            fileService.loadJsonFile(state.data.mapping).then((json)=>{
                state.data.mapping=JSON.parse(json);
                saveReport();
            })
        }else{
            saveReport();
        }

        function saveReport(){
            state;

            fileService.loadExcelFile(state.data.excelTemplate).then((wbBase64) =>{

                state.data.excelTemplate = wbBase64;
                state.data.key = state.metadata.key;
                
                var dsServiceMetadata = new dhis2API.dataStoreService("XLReport_Metadata");
                var dsServiceData = new dhis2API.dataStoreService("XLReport_Data");
                
                dsServiceMetadata.saveOrUpdate(state.metadata,function(error,response,body){
                     dsServiceData.saveOrUpdate(state.data,function(error,response,body){
                         goToReportList();
                     });
                });
               
                
            });
            
        }
    }
  
    function textInputChangedMetadata(name,e) {
        state.metadata[name] = e.target.value
        instance.setState(state)
    }
    
    function onPeriodTypeChange(e){
        state.metadata.periodType = e.target.selectedOptions[0].value;
        instance.setState(state);
    }

    function onReportTypeChange(e){
        state.metadata.reportType = e.target.selectedOptions[0].value;
        instance.setState(state);
    }
    
    function goToReportList(){
        window.location.href = "./index.html#/reports";        
    }

    function onChangeFileInput(name,e){
        state.data[name] = e.target.files[0];
        instance.setState(state);
    }
    
    instance.render = function(){
    
        return (            
                <form onSubmit={handleSubmit} >
                <input type="submit"  value="Save"></input>
                <input type="button" value="Cancel" onClick={goToReportList}></input>

                <table >
                <tbody>
                <tr>
                <td> Key: <input disabled id="key" value={state.metadata.key}  type="text"></input></td></tr>
                <tr>
                <td>Name : </td><td><input id="name" value={state.metadata.name} onChange={textInputChangedMetadata.bind(null,'name')} type="text"></input></td>
                </tr>
                <tr>
                <td>Description : </td><td><input id="description" onChange={textInputChangedMetadata.bind(null,'description')} type="text" value={state.metadata.description} ></input></td>
                </tr>
                <tr>
                <td>Period Type : </td><td><select id="periodType" value={state.metadata.periodType} onChange={onPeriodTypeChange}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option></select></td>
                </tr>
                <tr><td>Report Type: <select id="reportType" value={state.metadata.reportType} onChange={onReportTypeChange}>
                <option value="OUWiseProgressive">OUWiseProgressive</option>
                <option value="PeriodWiseProgressive">PeriodWiseProgressive</option></select></td></tr>

                <tr>
                <td>Org Unit Level : </td><td><input type="number" id="orgUnitLevel" value={state.metadata.orgUnitLevel} onChange={textInputChangedMetadata.bind(null,'orgUnitLevel')} ></input></td>
                </tr>
                <tr>
                <td>Upload Excel Template :</td><td> <input type="file" id="excelTemplate" onChange={onChangeFileInput.bind(null,'excelTemplate')} /></td>
                </tr>
                <tr>
                <td>Upload Mapping File : </td><td><input type="file" id="mappingFile" onChange={onChangeFileInput.bind(null,'mapping')} /></td>
                </tr>
                
            </tbody>
                </table>

      
            
                
                </form>
        )
    }

    return instance;
}
