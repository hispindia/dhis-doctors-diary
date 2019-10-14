import React,{propTypes} from 'react';
import constants from '../constants';
//import cache from '../localstorage';

import {Login} from './Login'
import {Calendar} from './Calendar'
import {DataEntryForm} from './DataEntryForm'
import {Loader} from './Loader'
import {Header} from './Header'
import {Settings} from './Settings'
import {Footer} from './Footer'
import {DoctorProfile} from './Profile'
import {ChangePassword} from './ChangePassword'
import {Info} from './Info'
import {Leftbar} from './Leftbar'
import {Reports} from './Reports'

export function Main(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var state = props.state;

    state.changeView = function(state){
        instance.setState(state);
    }

    function getLeftBarClass(){

            if (state.showLeftBar){
                return "two"
            }else{
                return "hide";
            }

    }
    
    function getRightBarClass(){
        if (state.showLeftBar){
            return "three"
        }else{
            return "threePlusTwo";
        }
    }
    
    instance.render = function(){

        switch(state.curr_view){
        case constants.views.login :
            return (<div >
                    <Header state={state}></Header>

                    <Login state={state}/>
                    <Footer state={state}/>
                    </div>
                   );
        case constants.views.calendar :        
        case undefined:
        default:
            return (<div >
                    <Header state={state} />
                    <div className="wrapper">
                    <div className={getLeftBarClass()}>
                    <Leftbar state={state}></Leftbar>
                    </div>
                    <div className={getRightBarClass()}>
                    <Calendar state={state}/>
                    </div></div>
                    <Footer state={state}/>
                    </div>
                   );
        case constants.views.entry :
            return (<div>
                    <Header state={state}></Header>
                    <div className="wrapper">
                    <div className={getLeftBarClass()}>
                    <Leftbar state={state}></Leftbar>
                    </div>
                    <div className={getRightBarClass()}>
                    <DataEntryForm state={state}/>
                    </div></div>
                    <Footer state={state}/>
                    </div>
                   );
        case constants.views.loader :
            return (<div>
                    <Loader state={state}/>
                    </div>
                   );
        case constants.views.settings :
            return (
                    <div >
                    <Header state={state} ></Header>
                    <div className="wrapper">
                    <div className={getLeftBarClass()}>
                    <Leftbar state={state}></Leftbar>
                    </div>
                    <div className={getRightBarClass()}>
                    <Settings state={state}/>
                    </div></div>
                    <Footer state={state}/>
                    </div>
                    
                   );
            
        case constants.views.profile :
            return (<div>
                    <Header state={state}></Header>
                    <div className="wrapper">
                    <div className={getLeftBarClass()}>
                    <Leftbar state={state}></Leftbar>
                    </div>
                    <div className={getRightBarClass()}>
                    <DoctorProfile state={state}/>
                    </div></div>
                    <Footer state={state}/>
                    </div>
                   );

        case constants.views.changePassword :
            return (<div>
                    <Header state={state}></Header>
                    <div className="wrapper">
                    <div className={getLeftBarClass()}>
                    <Leftbar state={state}></Leftbar>
                    </div>
                    <div className={getRightBarClass()}>
                    <ChangePassword state={state}/>
                    </div></div>
                    <Footer state={state}/>
                    </div>
                   );
        case constants.views.info :
                return (<div>
                        <Header state={state}></Header>
                        <div className="wrapper">
                        <div className={getLeftBarClass()}>
                        <Leftbar state={state}></Leftbar>
                        </div>
                        <div className={getRightBarClass()}>
                        <Info state={state}/>
                        </div></div>
                        <Footer state={state}/>
                    </div>
                       );
        case constants.views.reports:
            return (<div>
                    <Header state={state}></Header>
                    <div className="wrapper">
                    <div className={getLeftBarClass()}>
                    <Leftbar state={state}></Leftbar>
                    </div>
                    <div className={getRightBarClass()}>
                    <Reports state={state}/>
                    </div></div>
                    <Footer state={state}/>
                    </div>
                   );
      
            

        }
    }
    return instance;

  
}
