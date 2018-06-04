import React,{propTypes} from 'react';

export function DecocFormComponent(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.decoc;
    var init = props.init;
    var unSelectFunc = function(){};
    
    function unSelectPrevious(){
        unSelectFunc();
    }
    
    function setUnSelectPrevious(foo){
        unSelectFunc = foo;
    }

    
    function getRows(){
        return state.reduce((list,obj)=>{            
            list.push(<tr><td>
                      <Decoc state={obj}
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
                <div className="decocDiv " >
                <table className="decocTable ">
                <tbody>
                {getRows()}
            </tbody>
            </table>
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
                <div>
                <div>
                <input type="button" value="+" ></input>
                </div>
            <div onClick={onClick} className={state.click?'decocSelected':''}>
            <div> De : {init.deMap[state.decoc.de].name} </div>
            <div> Coc : {init.cocMap[state.decoc.coc].name} </div>
            <div> Row : {state.decoc.row} </div>
            <div> <ul>{getGroups(state.decoc.ougroup)}</ul> </div>
            </div>
                </div>
        )
    }

    return instance;
}
