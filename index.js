import React from 'react';
import ReactDOM from 'react-dom'
import dhis2API from './lib/dhis2API'

import {App} from './components/app';


window.onload = function(){
/* Menu Bar */
    try {
        if ('Dhis2HeaderBar' in window) {
            Dhis2HeaderBar.initHeaderBar(document.querySelector('#header'), '../../../api', { noLoadingIndicator: true });
        }
    } catch (e) {
        if ('console' in window) {
            console.error(e);
        }
    }
    
/********/

   
    dhis2API.getManifest().then(function(data){
        ReactDOM.render(
                <App baseURL={data.activities.dhis.href}/>
            ,
            document.getElementById('reportContainer'));
        
        
    })
    
  
}
