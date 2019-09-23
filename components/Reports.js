import React,{propTypes} from 'react';
import constants from '../constants';
import cache from '../localstorage';

export function Reports(props){
    var instance = Object.create(React.Component.prototype)

    var dirtyBit = true;

    instance.props = props;
    var state = props.state;
    state = {
        reports: "",
    }


    function componentDidMount() {
        var username = parseInt(cache.get("dd_current_user").username);
        var url = "https://uphmis.in/uphmis/api/29/analytics/events/query/Bv3DaiOd5Ai.html+css?dimension=pe:THIS_MONTH&dimension=ou:USER_ORGUNIT&dimension=T6eQvMXe3MO:EQ:"+username+"&dimension=W3RxC0UOsGY&tableLayout=true&columns=pe;ou;T6eQvMXe3MO;zfMOVN2lc1S&rows=pe;ou;T6eQvMXe3MO;zfMOVN2lc1S&user=oo3KPGux5RH";

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic '+btoa('admin:H!SPindia2017'),
                'Content-Type': 'text/html',
                'X-Custom-Header': 'ProcessThisImmediately',
            },
        })
            .then(res => res.text())
            .then((data) => {
                state.reports = data;
            })
            .catch(console.log)
        return {__html: state.reports};
    }
    function currentView(){
        dirtyBit = false;
        state.curr_view=constants.views.reports;
        state.changeView(state);
    }
    function back(){
        state.curr_view=constants.views.calendar;
        state.changeView(state);
    }

    var state = props.state;
    instance.render = function(){
        return (
                <div>
                  <button className="button1 button2" onClick={back}>Back</button>
                    <button className={dirtyBit?"button1 button2":"hidden"} onClick={currentView}>Show</button>
                    <div className={dirtyBit?"hidden":"reportSection"} >
                        <div dangerouslySetInnerHTML={componentDidMount()} />
                 </div>
                </div>
        )
    }
    return instance;
}
