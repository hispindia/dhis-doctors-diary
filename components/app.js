import React,{propTypes} from 'react';
import { BrowserRouter as Router , Route, Link,Switch,Redirect  } from 'react-router-dom'

import {Login} from './Login'
import {Calendar} from './Calendar'
import {Main} from './Main'
import {DoctorProfile} from './Profile'

export function App(props){
    
    var instance = Object.create(React.Component.prototype)
  
  
    instance.render = function(){
  
        return (  <Router basename={"/xl-report-mapping/index.html#"} >                 
                  <Switch>
                  <Route exact path="/login"  component={Login}  />
                  <Route exact path="/calendar"  component={Calendar}  />
                  <Route path="/entry"  component={Main}  />
                  <Route path="/doctorprofile"  component={DoctorProfile}  />

                  </Switch>

                  </Router>
               )
    }
    return instance
}
