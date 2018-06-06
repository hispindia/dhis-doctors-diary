import React,{propTypes} from 'react';

export function DecocFormComponent(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.mapping;
    var init = props.init;

     var decocRow = {
        de : "-1",
        coc :"-1",
        row: "",
        ougroup : "nogroup"        
    }

    var calcRow = {
        expression : "",
        row : ""
    }
   
    var unSelectFunc = function(){};
    
    function unSelectPrevious(){
        unSelectFunc();
    }
    
    function setUnSelectPrevious(foo){
        unSelectFunc = foo;
    }

    function deleteDecocRow(index){
        if (state.decoc.length == 1){return}
        
        state.decoc.splice(index,1);
        instance.setState(state);
    }


    function addDecocRow(index){
        
        var row = Object.assign({},decocRow);
        state.decoc.splice(index+1,0,row);
        instance.setState(state);
    }
    
    function textInputChangedData(name,e) {
        state[name] = e.target.value
        instance.setState(state)
    }
    
    
    function getRows(){
        return state.decoc.reduce((list,obj,index)=>{            
            list.push(<tr key={"tr_"+index}>
                      <td>({index+1})</td>

                      <td key={"td+_"+index}>
                      
                      <input type="button" value="+" onClick={addDecocRow.bind(null,index)} ></input></td>
                      <td key={"td-_"+index}><input type="button" value="-" onClick={deleteDecocRow.bind(null,index)} ></input></td>
                      <td key={"td_decoc_"+index}>
                      <Decoc key={"obj"+Math.random(1)}
                      index={index}
                      state={obj}
                      init={init}
                      unSelectPrevious={unSelectPrevious}
                      setUnSelectPrevious = {setUnSelectPrevious}
                      takeMyStuff = {props.takeMyStuff}
                      
                      />
                      </td></tr>);
            
            return list;
        },[]);
    }
    
    instance.render = function(){
        return (
            <div><div>
                 <table key="conf" >
                <tbody>
                <tr><td>Sheet Name: <input type="text" value={state.sheetName} onChange={textInputChangedData.bind(null,'sheetName')} ></input></td></tr>
                <tr><td>Start Column: <input type="text" value={state.pivotStartColumn} onChange={textInputChangedData.bind(null,'pivotStartColumn')} ></input></td></tr>
                <tr><td>Start Row: <input type="text" value={state.pivotStartRow} onChange={textInputChangedData.bind(null,'pivotStartRow')} ></input></td></tr>
                <tr><td>End Row: <input type="text" value={state.pivotEndRow} onChange={textInputChangedData.bind(null,'pivotEndRow')} ></input></td></tr>
                <tr><td>Period Cell: <input type="text" value={state.periodCell} onChange={textInputChangedData.bind(null,'periodCell')} ></input></td></tr>
                <tr><td>Facility Cell: <input type="text" value={state.facilityCell} onChange={textInputChangedData.bind(null,'facilityCell')} ></input></td></tr>
            </tbody>
            </table></div>
                <h3>Decoc</h3>
                <div className="decocDiv " >
                
                <table className="decocTable ">
                <tbody>
                {getRows()}
            </tbody>
            </table>
                </div>
                </div>
            
        )
    }
    return instance;
}

function Decoc(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = {
        decoc : props.state,
        click : false
    }
    var init = props.init;
    
    function getGroups(groups){
        
        var grps = groups.split("-");
        return grps.map(key => {
                return <li>{init.ouGroupMap[key].name}</li>
        })
    }

    function onClick(){
        if (state.click){return}
        state.click = true;
        instance.setState(state);
        props.unSelectPrevious();
        props.setUnSelectPrevious(unClick);
        props.takeMyStuff(state.decoc,changeMyState);
        
    }

    function changeMyState(state){
        instance.setState(state)
    }
    
    function unClick(){
        state.click = false;
        instance.setState(state);
    }
    
    instance.render = function(){
        return(
                <div key={"div_decoc_"+props.index}>
                <div onClick={onClick} className={state.click?'decocSelected':''}>
                <div> <b>De:</b> {init.deMap[state.decoc.de].name} </div>
                <div> <b>Coc:</b> {init.cocMap[state.decoc.coc].name} </div>
                <div className="highlightRow"><b> Row:</b> {state.decoc.row} </div>
                <div> <ul>{getGroups(state.decoc.ougroup)}</ul> </div>
                </div>
                </div>
        )
    }

    return instance;
}
