import React,{propTypes} from 'react';
import { BrowserRouter as Router , Route, Link,Switch  } from 'react-router-dom'

import {ReportList} from './reportList'
import {EditReportForm} from './editReportForm'
import {NewReportForm} from './newReportForm'

export function App(props){
    
    var instance = Object.create(React.Component.prototype)
  
  
    instance.render = function(){
        var baseName = props.baseURL.split("/")
        baseName = baseName[baseName.length-1];
        
        return (  <Router basename={baseName+"/api/apps/datastore/index.html#"} >                 
                  <Switch>
                  <Route exact path="/reports"  component={ReportList}  />
                  <Route exact path="/reports/add"  component={NewReportForm}  />
                  <Route  path="/reports/edit/"  component={EditReportForm}  />

                  </Switch>
                  </Router>
               )
    }
    return instance
}
