import React,{propTypes} from 'react';

export function Loader(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
   
    instance.render = function(){
  
        return (
                <div>
                Loading...
            </div>

        )
    }
    
    return instance;
}
