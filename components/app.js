import React,{propTypes} from 'react';
import { BrowserRouter as Router , Route, Link,Switch,Redirect  } from 'react-router-dom'

import {Login} from './Login'
import {Calendar} from './Calendar'

import {EditReportForm} from './editReportFormX'
import {NewReportForm} from './newReportForm'

export function App(props){
    
    var instance = Object.create(React.Component.prototype)
  
  
    instance.render = function(){
  
        return (  <Router basename={"/xl-report-mapping/index.html#"} >                 
                  <Switch>
                  <Route exact path="/login"  component={Login}  />
                  <Route exact path="/calendar"  component={Calendar}  />
                  <Route path="/reports/edit/"  component={EditReportForm}  />

                  </Switch>

                  </Router>
               )
    }
    return instance
}
