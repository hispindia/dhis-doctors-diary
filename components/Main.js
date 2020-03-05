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
import {Error} from './Error'
import cache from "../localstorage";

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
    function reset(){
        cache.reset();
        state.curr_view=constants.views.login;
        state.changeView(state);
    }
    
    instance.render = function(){
try{
        switch(state.curr_view){
        case constants.views.login :
            return (<div >
                    <Header state={state}></Header>
                    <Login state={state}/>
                    <Footer state={state}/>
                    </div>
                   );
        case constants.views.calendar :
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
            case constants.views.error:
                return (<div>
                            <Error state={state}/>
                        </div>);
            

        }
    }
    catch (error) {
        return (<div className="calendarArea">
            <h2>Previous Cache Found</h2>
            <br/><br/>
            <p>Please click on "Clear" button to clean cache</p>
            <input className="settingBt" type="button" onClick = {reset} value="Clear"></input>
            {error}
        </div>)
    }
}
    return instance;

  
}
