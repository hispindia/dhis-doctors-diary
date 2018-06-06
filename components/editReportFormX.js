import React,{propTypes} from 'react';
import dhis2API from '../lib/dhis2API';
import {RowSelectionComponent} from './RowSelectionComponent';
import {DecocFormComponent} from './DecocFormComponent';
import {MetadataFormComponent} from './MetadataFormComponent';
import {CalculatedFieldsComponent} from './CalculatedFieldsComponent';

export function EditReportForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
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
        var cocP = mdService.getObj("categoryOptionCombos?fields=id,name&paging=false");
        
        Promise.all([deP,
                     ougP,
                     PreportMetadata,
                     PreportData,
                     cocP]).
            then(values => {
                
                var des = values[0].dataElements;
                var ougs = values[1].organisationUnitGroups;
                var cocs = values[4].categoryOptionCombos;
                state.init.des = des;
                state.init.ougs = ougs;

                state.init.deMap = des.reduce((map,obj)=>{
                    map[obj.id] = obj;
                    return map;
                },[])
                state.init.deMap["-1"] = {name : "-1"}
                
                state.init.cocMap = cocs.reduce((map,obj)=>{
                    map[obj.id] = obj;
                    return map;
                },[])
                state.init.cocMap["-1"] = {name : "-1"}
                
                
                state.metadata = values[2];
                state.data = values[3];
                
                var ouGroupMap = state.init.ougs.reduce((map,obj)=>{
                    map[obj.id] = obj;
                    return map;
                },[]);
                ouGroupMap["nogroup"] = {id:"nogroup",
                                         name:"nogroup"}

                state.init.ouGroupMap = ouGroupMap;
                
                instance.setState(Object.assign({},state));
            })
    }

    init();

    var foo = function(){};
    var decocStuff = function(state,changeState){
        foo(state,changeState)
    }
    
    function registerHandler(_foo){
        foo = _foo;
    }


    
    function goToReportList(){
        window.location.href = "./index.html#/reports";        
    }
    
    instance.render = function(){
        if (!state.init.deMap){ return <div></div>  }
        return (
            <div>
              <input type="submit"  value="Save" onClick={saveForm.bind(null,state)} ></input>
              <input type="button" value="Cancel" onClick={goToReportList}></input>
              
              <h3>Metadata</h3>
              { <MetadataFormComponent metadata={state.metadata}/>}
              <div className="DecocContainer">
                <h3>Conf </h3>
                {<RowSelectionComponent init={ state.init}
                                        registerHandler = {registerHandler} />}
                {<DecocFormComponent
                        mapping={state.data.mapping}
                        init={ state.init}
                        takeMyStuff = {decocStuff}
                    />}
              </div>
              <br/>
              <h3> Calculated Fields </h3>
              
              {<CalculatedFieldsComponent calc={state.data.mapping.calc} />}
            </div>
        )
    }
    
    return instance;  
}

function saveForm(state,e){

    if (!validate(state)){
        return
    }
    
    var metadata = state.metadata;    
    var data = state.data;
    
    var excelP = null;
    if (state.metadata.excel && state.metadata.excel.file){
        var fileService = require('../utility-fileOps');
        
        excelP = fileService.loadExcelFile(state.metadata.excel.file);
        
        delete state.metadata.excel.file;
        excelP.then(function(value){
            data.excelTemplate =  value;
            
            var dsServiceMetadata = new dhis2API.dataStoreService("XLReport_Metadata");
            var dsServiceData = new dhis2API.dataStoreService("XLReport_Data");
            
            dsServiceMetadata.saveOrUpdate(metadata,function(error,response,body){
                if (error){
                    console.log("Error saving metadata");            
                    return;
                }
                
                dsServiceData.saveOrUpdate(data,function(error,response,body){
                    if (error){
                        console.log("Error saving data");            
                    }
                });
            });
        });
        
    }else{
        save();
    }

    function save(){

        var dsServiceMetadata = new dhis2API.dataStoreService("XLReport_Metadata");
        var dsServiceData = new dhis2API.dataStoreService("XLReport_Data");
        
        dsServiceMetadata.saveOrUpdate(metadata,function(error,response,body){
            if (error){
                console.log("Error saving metadata");            
                    return;
            }
            
            dsServiceData.saveOrUpdate(data,function(error,response,body){
                if (error){
                    console.log("Error saving data");            
                }
            });
        });
    }
}

function validate(state){
    
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

