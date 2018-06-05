import React,{propTypes} from 'react';

export function RowSelectionComponent(props){
    var instance = Object.create(React.Component.prototype);
    instance.props = props;

    var init = props.init;
    var decocChangeState = function(){};
    
    var state = {
        de:"-1",
        coc:"",
        ougroup:"",
        row:""
    };

    props.registerHandler(decocStuffCame);
    
    function decocStuffCame(decocState,_decocChangeState){
        
        state = decocState;
        instance.setState(state);
        decocChangeState = _decocChangeState;
        
    }

    
    function getDeOptions(){
        
        var options = init.des.reduce((list,obj)=>{
            
            list.push(<option key={obj.id} value={obj.id}>{obj.name}</option>);
            return list;
        },[<option disabled value = "-1">--please select a de--</option>]);
        return options;
    }

    function getCOCOptions(){
        if (state.de == "-1"){return;}
        
        var coc = init.deMap[state.de].categoryCombo.categoryOptionCombos;

        var options = coc.reduce((list,obj) =>{
            list.push(<option value={obj.id}>{obj.name}</option>);
            return list;
        },[]);

        return options;
    }

    function getOUGOptions(){
        
        var options = [];        
        options =  init.ougs.reduce((list,obj)=>{            
            list.push(<option key={obj.id}
                      value={obj.id}>{obj.name}</option>);
            return list;
        },[<option value="nogroup">nogroup</option>]);
        
        return options;
    }
    
    function onDeChange(e){
        state.de = e.target.value;
        instance.setState(state);        
        decocChangeState(state);
    }

    function onCOCChange(e){
        state.coc = e.target.value;
        instance.setState(state);
        decocChangeState(state);
    }
    
    function onOUGroupChange(e){
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
        
        state.ougroup = str;
        instance.setState(state);
        decocChangeState(state);
    }

    function onRowChange(e){
        state.row = e.target.value;
        instance.setState(state);
        decocChangeState(state);
    }
    
    instance.render = function(){
        return (
                <div className="rowSelection">
                
              <table>
                <tbody>
                <tr> <td> Row : </td><td> <input type="text"
            value = {state.row}
                                                   onChange={onRowChange}>
                </input>
                </td> </tr>
                
                  <tr> <td>DE : </td>
                    <td><select className="decocDE"
                                value={state.de}
                                onChange={onDeChange}
                                >{getDeOptions()}
                      </select>
                  </td> </tr>
                  
                  
                  <tr> <td> COC :</td>
                    <td> <select key={"coc"}
                                 value={state.coc}
                                 onChange={onCOCChange}
                                 > {getCOCOptions()}
                      </select>
                  </td> </tr>
                  
                  <tr> <td>OUGroup :</td><td> <select multiple
                                                      className="ougroupSelect"
                                                      key={"oug"}
                                                      value={state.ougroup.split("-") }
                                                      onChange = {onOUGroupChange}
                                                      > {getOUGOptions()}
                        
                      </select>
                  </td> </tr>
                  
                  
                  
                </tbody>
              </table>
                
                <pre>{JSON.stringify(state, null, 2) }</pre>
                
              
            </div>
            
        );
    };
    return instance;
}
