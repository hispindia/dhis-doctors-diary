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

    var forcePassword = false;
    
    if (state.curr_user_data.user.surname){
        if (state.curr_user_data.user.surname.substr(state.curr_user_data.user.surname.length -1) == "|"){
            forcePassword = true;
        }   
    }
    
  
    function getAttributeValue(avals,id){
        for (var i=0;i<avals.length;i++){
            var obj = avals[i];
            if (obj.attribute.id = id){
                return obj.value;
            }
        }
        return false;
    }
    
    function textInputChangedData(name,e,qas,ads) {
        credential[name] = e.target.value
        instance.setState(credential)
    }
    
    instance.render = function(){

        return(
                <div className="entryArea">
                <div className="entryStageDiv">
                
                <h2>Change password </h2>

                <h6>{ utility.makeFacilityStrBelowLevel(state.curr_user_data.user.organisationUnits[0],2) } </h6>
                
                <div>

                <div hidden
            className="entryQuestionDiv"
            key ="previous_Q" >
                <p>Current Password</p>
                <div className="entryAnswerDiv">
                <input
                    className="form-control"
                    key="previous"
                    type = {credential.showpassword?"text":"password"}
                    value = {credential.oldpassword}
                    onChange={textInputChangedData.bind(null,'oldpassword')}
                ></input>
                
            </div>
                </div>
            
                <div
            className="entryQuestionDiv"
            key ="new_Q" >
                <p>New Password</p>
                <div className="entryAnswerDiv">
            
                <input
                    className="form-control"
                    key="new"
                    type = {credential.showpassword?"text":"password"}
                    value = {credential.newpassword}
                    onChange={textInputChangedData.bind(null,'newpassword')}
                ></input>
    
            </div>
                </div>
            
                <div
            className="entryQuestionDiv"
            key ="confirm_Q" >
                <p>Confirm Password</p>
                <div className="entryAnswerDiv">
                <input
                    className="form-control"
                    key="confirm"
                    type = {credential.showpassword?"text":"password"}
                    value = {credential.confirmpassword}
                    onChange={textInputChangedData.bind(null,'confirmpassword')}
                ></input>
                </div>
                </div>
                
            </div>
                </div>
            
                <div className="entrySaveDiv">
                
                <input disabled={forcePassword?true:false} className="button1 button2" type="button" value="Back" onClick={back}></input>
                <input className={"button1 button2"}
            type="button"
            value="Change"
            onClick={changePassword}></input>
                
                </div>
                </div>
                
            
        )
    }

    function back(){
        state.curr_view=constants.views.settings;
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
