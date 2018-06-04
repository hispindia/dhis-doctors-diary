import React,{propTypes} from 'react';
import dhis2API from '../lib/dhis2API';
import {RowSelectionComponent} from './RowSelectionComponent'
import {DecocFormComponent} from './DecocFormComponent'
import {MetadataFormComponent} from './MetadataFormComponent'
import {CalculatedFieldsComponent} from './CalculatedFieldsComponent'

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

                state.init.cocMap = cocs.reduce((map,obj)=>{
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

                state.init.ouGroupMap = ouGroupMap;
                
                state.data.mapping.decoc = state.data.mapping.decoc;
                
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


    function saveForm(){
        debugger
    }
    
    function goToReportList(){
        window.location.href = "./index.html#/reports";        
    }
 
    instance.render = function(){
        if (!state.init.deMap){ return <div></div>  }
        return (
                <div>
                <input type="submit"  value="Save" onClick={saveForm} ></input>
                <input type="button" value="Cancel" onClick={goToReportList}></input>
              
                <h3>Metadata</h3>
            { <MetadataFormComponent metadata={state.metadata}/>}
                <h3>Decoc </h3>
                {<RowSelectionComponent init={ state.init}
                 registerHandler = {registerHandler} />}
            {<DecocFormComponent
             decoc={state.data.mapping.decoc}
             init={ state.init}
             takeMyStuff = {decocStuff}
             />}
                <h3> Calculated Fields </h3>
                {<CalculatedFieldsComponent calc={state.data.mapping.calc} />}
            </div>
        )
    }
    
    return instance
    
}
