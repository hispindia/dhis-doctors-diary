import React,{propTypes} from 'react';
import moment from 'moment';
import api from '../dhis2API';
import constants from '../constants';

export function Reports(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var state = props.state;

    function componentDidMount(){
        var url = "https://uphmis.in/uphmis/api/29/analytics/events/query/Bv3DaiOd5Ai.json?dimension=pe:LAST_3_MONTHS&dimension=ou:USER_ORGUNIT&dimension=U0jQjrOkFjR&dimension=T6eQvMXe3MO:EQ:218491&dimension=zfMOVN2lc1S&dimension=W3RxC0UOsGY&stage=Bm7Bc9Bnqoh&displayProperty=NAME&tableLayout=true&columns=pe;ou;U0jQjrOkFjR;T6eQvMXe3MO;zfMOVN2lc1S;W3RxC0UOsGY&rows=pe;ou;U0jQjrOkFjR;T6eQvMXe3MO;zfMOVN2lc1S;W3RxC0UOsGY&user=oo3KPGux5RH";

        var apiWrapper = new api.wrapper();
        apiWrapper.getObj(url,function(error,body,response){
            if (error){
                alert("An unexpected error occurred." + error);
                return;
            }

            var reportuids = response.rows.reduce(function(str,obj){
                str = str + obj[0] + ";"
                return str;
            },"")

            callback(reportuids)

        })
        this.serverRequest =
            axios
                .get()
                .then(function(result) {
                    _this.setState({
                        data: result.data.headers
                    });
                })
    }

    function componentWillUnmount(){
        this.serverRequest.abort();
    }
    function back(){
        state.curr_view=constants.views.calendar;
        state.changeView(state);
    }
    
    var state = props.state;
    instance.render = function(){
        return (
              <div>

                <div className="">

                <table className="tableDiv">
                <tbody>
                <tr>
                    <td>
                        <button className="settingsButton" onClick={back}>Back</button>
                    </td>
                </tr>
              
           
                </tbody>
                </table>


            </div>
                </div>
        )
    }
    return instance;
}
