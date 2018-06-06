import React,{propTypes} from 'react';

export function CalculatedFieldsComponent(props){

    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.calc;
    var calcRow = {
        expression : "",
        row : ""
    }
    
     function getCalculatedFields(){
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
            state.splice(index+1,0,row);
            instance.setState(state);
            
        }
        
         function deleteRow(index){
             if (state.length == 1){return}
            state.splice(index,1);
            instance.setState(state);
        }
        
        var calc = state.reduce((list,obj,index) => {
            list.push(<tr>
                      <td>({index+1})</td>
                      <td><input type="button" value="+" onClick={addRow.bind(null,index)}></input></td>
                      <td><input type="button" value="-" onClick={deleteRow.bind(null,index)}></input></td>
                      <td><input type="text" value = {obj.row} onChange={onRowChange.bind(null,obj)} ></input></td>
                      <td><textarea rows="5" cols="50" value = {obj.expression} onChange = {onExpressionChange.bind(null,obj)}></textarea></td>
                      <td><div className=""><pre>{JSON.stringify(obj, null, 2) }</pre></div></td>
                      
                      </tr>)
            return list;
        },[])
        
        return calc;
    }

    instance.render = function(){
        return (<div className="calcDiv">
                <table key="calcFields" className="calcTable">
                <thead>
                <tr><th>#</th><th>$</th><th>$</th><th>Row</th><th>Expression</th><th><i>Mapping</i></th></tr>
                </thead>
                <tbody>
                {getCalculatedFields()}
            </tbody>
                </table>
                </div>
               
        )        
    }

    return instance;
}
