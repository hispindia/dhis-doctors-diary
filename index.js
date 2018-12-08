import React from 'react';
import ReactDOM from 'react-dom'
import dhis2API from './lib/dhis2API'
import cache from './cacheService.js';

import {App} from './components/app';


window.onload = function(){
    
    ReactDOM.render(
            <App />
            ,
        document.getElementById('login'));
    
    
    
}
