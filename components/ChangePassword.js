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
        newpassword : "Harsh@12345",
        oldpassword : "Harsh@12347",
        confirmpassword : "Harsh@1234"
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

                <div
            className="entryQuestionDiv"
            key ="previous_Q" >
                <p>Current Password</p>
                <div className="entryAnswerDiv">
                <input
            key="previous"
            type = "text"
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
            key="new"
            type = "text"
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
            key="confirm"
            type = "text"
            value = {credential.confirmpassword}
            onChange={textInputChangedData.bind(null,'confirmpassword')}
                ></input>
                </div>
                </div>
                
            </div>
                </div>
            
            

                <div className="entrySaveDiv">
                
                <input className="button" type="button" value="Back" onClick={back}></input>
                <input className={"button"}
            type="button"
            value="Change"
            onClick={changePassword}></input>
                
                </div>
                </div>
                
            
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
