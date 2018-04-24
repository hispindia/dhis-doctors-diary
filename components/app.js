import React,{propTypes} from 'react';
import { BrowserRouter as Router , Route, Link,Switch  } from 'react-router-dom'

import {ReportList} from './reportList'
import {NewReportForm} from './newReportForm'



export function App(){
    var instance = Object.create(React.Component.prototype)
  
  
    instance.render = function(){
        return (  <Router basename="/state227/api/apps/react-skeleton/index.html#" >                 
                  <Switch>
                  <Route exact path="/reports"  component={ReportList}  />
                  <Route  path="/reports/"  component={NewReportForm}  />
                  </Switch>
                  </Router>
               )
    }
    return instance
}
