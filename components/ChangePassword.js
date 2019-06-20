import React,{propTypes} from 'react';
import cache from '../localstorage';
import constants from '../constants';
import utility from '../utility';
import sync from '../sync-manager';

export function ChangePassword(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;
    var credential = {
        newpassword : "",
        oldpassword : "",
        confirmpassword : "",
        showpassword : true
    }

    function textInputChangedData(name,e,qas,ads) {
        credential[name] = e.target.value
        instance.setState(credential)
    }
    
    instance.render = function(){

        return(
                <div className="container">
                <div className="row">
                
                <h2>Change password </h2>

                <h6>{ utility.makeFacilityStrBelowLevel(state.curr_user_data.user.organisationUnits[0],2) } </h6>
                    <br/><br/>
                <div className="col-sm-6">
                <div
            key ="previous_Q" >
                <p>Current Password</p>
                <div>
                <input
                    className="form-control"
            key="previous"
            type = {credential.showpassword?"text":"password"}
            value = {credential.oldpassword}
            onChange={textInputChangedData.bind(null,'oldpassword')}
                ></input>
                
            </div>
                </div>
                        <br/>
                <div
            key ="new_Q" >
                <p>New Password</p>
                <div >
            
                <input className="form-control"
            key="new"
            type = {credential.showpassword?"text":"password"}
            value = {credential.newpassword}
            onChange={textInputChangedData.bind(null,'newpassword')}
                ></input>
    
            </div>
                </div>
            <br/>
                <div
            key ="confirm_Q" >
                <p>Confirm Password</p>
                <div >
                <input
            key="confirm" className="form-control"
            type = {credential.showpassword?"text":"password"}
            value = {credential.confirmpassword}
            onChange={textInputChangedData.bind(null,'confirmpassword')}
                ></input>
                </div>
                </div>
                


 <div >
     <br/><br/>
                    <span className="col-sm-3"> <input className="btn" type="button" value="Back" onClick={back}></input></span>
                    <span className="col-sm-3"> <input className="btn"
            type="button"
            value="Change"
                                                       onClick={changePassword}></input></span>
                
                </div>
                </div>
                </div></div>
            
        )
    }

    function back(){
        state.curr_view=constants.views.calendar;
        state.changeView(state);
        
    }
    
    function changePassword(){
        

        if (!validator()){
            return;
        }

        sync.changePassword(state,credential,function(){
            
            state.curr_view=constants.views.calendar;
            state.changeView(state);
            
        })
        

        function validator(){

            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

            if (!strongRegex.test(credential.newpassword)){
                alert("Password must contain atleast 1 number, 1 lowercase letter, 1 upper case letter and length must be 8 or more.")
                return false;
            }

            if (credential.newpassword != credential.confirmpassword){
                alert("Passwords do not match");
                return false;
            }
            
            return true;
        }

    }
    return instance;
}
