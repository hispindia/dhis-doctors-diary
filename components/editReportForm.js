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

export function EditReportForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var decocRow = {
        de : "-1",
        coc :"",
        row: "",
        ougroup : "nogroup",
        ougroupList : ["nogroup"],
        selOUGroup :["nogroup"]
        
    }

    var calcRow = {
        expression : ""
    }
    
    var state = {
        metadata : {
          
        },
        data : {
         
        },
        init : {
            des : [],
            ougs : []
        }
    }

    function init(){

        var reportKey =  window.location.hash.split("#/reports/edit/")[1];   
        
        var dsServiceMeta = new dhis2API.dataStoreService('XLReport_Metadata');
        var dsServiceData = new dhis2API.dataStoreService('XLReport_Data');
        var mdService = new dhis2API.metadataService();
        
        var PreportMetadata = dsServiceMeta.getValue(reportKey);
        var PreportData = dsServiceData.getValue(reportKey);
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

            state.metadata = values[2];
            state.data = values[3];
            state.data.mapping = JSON.parse(state.data.mapping)

            var ouGroupMap = state.init.ougs.reduce((map,obj)=>{
                map[obj.id] = obj;
                return map;
            },[]);
            ouGroupMap["nogroup"] = {id:"nogroup",
                                     name:"nogroup"}
            
            state.data.mapping.decoc = state.data.mapping.decoc.reduce((list,obj)=>{

                var groups = obj.ougroup.split("-");
                obj.ougroupList = [];
                obj.selOUGroup = [];
                for (var key in groups){
                    var id = groups[key]
                    obj.selOUGroup.push(ouGroupMap[id].name);
                    obj.ougroupList.push(id)
                }
                list.push(obj)
                return list;
            },[])
            debugger
            instance.setState(Object.assign({},state));
        })
    }

     init();

  
    function validate(){debugger
        
        if (!state.metadata.name){
            alert("name missing")
            return false;
        }

        if (!state.data.excelTemplate){
            alert("Please upload excel template")
            return false;
        }

        if (!state.data.mapping.sheetName){
            alert("SheetName missing")
            return false;
        }

        
        if (!state.data.mapping.pivotStartColumn){
            alert("Decoc Mapping : StartColumn missing")
            return false;
        }
        if (!state.data.mapping.pivotStartRow){
            alert("Decoc Mapping : StartRow missing")
            return false;
        }
        if (!state.data.mapping.pivotEndRow){
            alert("Decoc mapping : endRow missing")
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
            
            
        })
    
        
    }
    
     function getDecocRows(){


         function getCOCOptions(obj){
             if (obj.de == "-1"){return}
             
             var coc = state.init.deMap[obj.de].categoryCombo.categoryOptionCombos;

             var options = coc.reduce((list,obj) =>{

                 list.push(<option value={obj.id}>{obj.name}</option>)
                 return list;
             },[])

             
             return options;
         }

         function getOUGOptions(){

             var options = [];

             options.push()
             
             options =  state.init.ougs.reduce((list,obj)=>{
                 
                 list.push(<option key={obj.id} value={obj.id}>{obj.name}</option>)
                 return list;
             },[<option value="nogroup">nogroup</option>])
             return options;
         }

         function getDeOptions(){

             var options = state.init.des.reduce((list,obj)=>{
                 
                 list.push(<option key={obj.id} value={obj.id}>{obj.name}</option>)
                 return list;
             },[<option disabled value = "-1">--please select a de--</option>])
             return options;
         }

         function onDeChange(obj,e){
             obj.de = e.target.selectedOptions[0].value;
             var coc = state.init.deMap[obj.de].categoryCombo.categoryOptionCombos;
             obj.coc = coc[0].id
             instance.setState(state);
         }

         function onCOCChange(obj,e){
             obj.coc = e.target.selectedOptions[0].value;
             instance.setState(state);
         }

         function onOUGroupChange(obj,e){
             var selGroups = e.target.selectedOptions;

             var str = ""
             for (var key=0; key<selGroups.length;key++){
                 var group = selGroups[key];
                 if (str == ""){
                     str=group.value;
                 }else{
                     str = str+"-"+group.value
                 }
             }
          
             var list = []
             var selOUGroup = []
             for (var key=0; key<selGroups.length;key++){
                 list.push(selGroups[key].value);
                 selOUGroup.push(selGroups[key].text)
             }
             
             obj.ougroupList = list;
             obj.ougroup = str;
             obj.selOUGroup = selOUGroup;
             instance.setState(state);
             
         }

         function onRowChange(obj,e){
             obj.row = e.target.value;
             instance.setState(state);
         }
         
         function addRow(index){
             var row = Object.assign({},decocRow);
             state.data.mapping.decoc.splice(index+1,0,row);
             instance.setState(state);
             
         }

         function deleteRow(index){
             state.data.mapping.decoc.splice(index,1);
             instance.setState(state);
         }

         function getSelectedOUGroups(groups){

             var groups = groups.reduce((list,obj)=>{
                 list.push(<li>{obj}</li>)
                 return list;
             },[])
             return  ( <ul>
                       {groups}
                       </ul>
             )
         }
         
         var decoc = state.data.mapping.decoc.reduce((list,obj,index) => {
             list.push(<tr key={obj.row+"tr"}>
                       <td>({index+1})</td>
                       <td><input type="button" value="+" onClick={addRow.bind(null,index)}></input></td>
                       <td><input type="button" value="-" onClick={deleteRow.bind(null,index)}></input></td>
                       <td><select className="decocDE" key={index+"de"} value={obj.de} onChange={onDeChange.bind(null,obj)} > {getDeOptions()}</select> </td>
                       <td><select key={index+"coc"} value={obj.coc} onChange={onCOCChange.bind(null,obj)} > {getCOCOptions(obj)}</select></td>
                       <td><select multiple className="ougroupSelect" key={index+"oug"} value={obj.ougroupList} onChange={onOUGroupChange.bind(null,obj)}> {getOUGOptions()}</select></td>
                       <td>{getSelectedOUGroups(obj.selOUGroup)}</td>
                       <td><input type="text" value = {obj.row} onChange = {onRowChange.bind(null,obj)}></input></td>
                       <td><div className="decocJSON"><pre>{JSON.stringify(obj, null, 2) }</pre></div></td>
                       
                      </tr>)
            return list;
        },[])

        return decoc;
    }


    function getCalculatedFields(){
        if (!state.data.mapping.calc){return}
        function onExpressionChange(obj,e){
            obj.expression = e.target.value;
            instance.setState(state);
        }

        function onRowChange(obj,e){
            obj.row = e.target.value;
            instance.setState(state);
        }
        
        function addRow(index){
            var row = Object.assign({},calcRow);
            state.data.mapping.calc.splice(index+1,0,row);
            instance.setState(state);
            
        }
        
        function deleteRow(index){
            state.data.mapping.calc.splice(index,1);
            instance.setState(state);
        }
        
        var calc = state.data.mapping.calc.reduce((list,obj,index) => {
            list.push(<tr>
                      <td>({index+1})</td>
                      <td><input type="button" value="+" onClick={addRow.bind(null,index)}></input></td>
                      <td><input type="button" value="-" onClick={deleteRow.bind(null,index)}></input></td>
                      <td><textarea rows="5" cols="30" value = {obj.expression} onChange = {onExpressionChange.bind(null,obj)}></textarea></td>
                      <td><div className="decocJSON"><pre>{JSON.stringify(obj, null, 2) }</pre></div></td>
                      
                      </tr>)
            return list;
        },[])
        
        return calc;
    }

    function textInputChangedMetadata(name,e) {
        state.metadata[name] = e.target.value
        instance.setState(state)
    }

    function textInputChangedData(name,e) {
        state.data.mapping[name] = e.target.value
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
    
    instance.render = function(){
        if (!state.data.mapping){return <div></div>}
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
                <td>Upload Excel Template </td><td><UploadFile id="excelFile"/></td>
                </tr>
                <tr>
                <td>Upload Mapping File : </td><td><UploadFile id="jsonFile" /></td>
                </tr>
                
            </tbody>
                </table>

          <div>

            <h3> Mapping </h3>
            <table key="conf" >
                <tbody>
                <tr><td>Sheet Name: <input type="text" value={state.data.mapping.sheetName} onChange={textInputChangedData.bind(null,'sheetName')} ></input></td></tr>
                <tr><td>Start Column: <input type="text" value={state.data.mapping.pivotStartCol} onChange={textInputChangedData.bind(null,'pivotStartCol')} ></input></td></tr>
                <tr><td>Start Row: <input type="text" value={state.data.mapping.pivotStartRow} onChange={textInputChangedData.bind(null,'pivotStartRow')} ></input></td></tr>
                <tr><td>End Row: <input type="text" value={state.data.mapping.pivotEndRow} onChange={textInputChangedData.bind(null,'pivotEndRow')} ></input></td></tr>
                <tr><td>Period Cell: <input type="text" value={state.data.mapping.periodCell} onChange={textInputChangedData.bind(null,'periodCell')} ></input></td></tr>
                <tr><td>Facility Cell: <input type="text" value={state.data.mapping.facilityCell} onChange={textInputChangedData.bind(null,'facilityCell')} ></input></td></tr>
            </tbody>
            </table>
                <h3> Decoc </h3>
                <table key="decoc" className="decocTable">
                <thead>
                <tr><th>#</th><th>$</th><th>$</th><th>Data Element </th><th>CategoryOptionCombo</th><th>Org Unit Groups</th><th>Selected OUGroups</th><th>Row</th><th><i>Mapping</i></th></tr>
                </thead>
                <tbody>
                {getDecocRows()}
            </tbody>
                </table>
                </div>
                
              <div>
                <h3> Decoc </h3>
                <table key="calcFields" className="decocTable">
                <thead>
                <tr><th>#</th><th>$</th><th>$</th><th>Expression</th><th><i>Mapping</i></th></tr>
                </thead>
                <tbody>
                {getCalculatedFields()}
            </tbody>
            </table>            
                </div>
                
                </form>
        )
    }

    return instance;
}
