import React,{propTypes} from 'react';

export function Header(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
   
    instance.render = function(){
  
        return (
                <div>
                
            </div>

        )
    }
    
    return instance;
}
