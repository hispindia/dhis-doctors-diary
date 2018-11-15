import React, { Component } from 'react';
import FormElement from "./FormElement";
import api from "./api.js";
import "./styles.css";
import logo  from './loading.gif'

//TODO: FIX generic OU and program in /api-getUnserInfo


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
		login: 1,
		//login explained:
		//1 - login screen
		//2 - waiting screen
		//3 - register new user screen
		//4 - event page - register new event / view old events
		//5 - render selected event
		programs: {}, //fills up from getProgramsFromDhis2
		username: "",
		password: "",
		trackedEntityInstance: "",
		enrollment: "",
		orgUnit: "",
		chosenProgram: "r6qGL4AmFV4",	   //todo: fix for UP-instance
		chosenProgramStage: "ZJ9TrNgrtfb", //todo: fix for UP-instance
		chosenEvent: "",
		timeToLogOut: false,
		handleSubmit: [],
    };
	
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleLoginChange = this.handleLoginChange.bind(this);
	this.handleUsernameChange = this.handleUsernameChange.bind(this);
	this.handlePasswordChange = this.handlePasswordChange.bind(this);
	this.handleProgramsChange = this.handleProgramsChange.bind(this);
	this.updateLocalStorage = this.updateLocalStorage.bind(this);
	this.handleTrackedEntityChange = this.handleTrackedEntityChange.bind(this);
	this.handleChosenEventChange = this.handleChosenEventChange.bind(this);
	this.handleEnrollementChange = this.handleEnrollementChange.bind(this);
	this.handleOrgUnitChange = this.handleOrgUnitChange.bind(this);
	this.getLocalStorage = this.getLocalStorage.bind(this);
	this.getPrograms = this.getPrograms.bind(this);
	this.getState = this.getState.bind(this);
	this.getChosenEvent = this.getChosenEvent.bind(this);
	this.clearChosenEvent = this.clearChosenEvent.bind(this);
	this.addToHandleSubmit = this.addToHandleSubmit.bind(this);
	}

	componentDidMount = () => {;
		this.getLocalStorage()
		//localStorage.setItem("state", JSON.stringify(this.state));
	}

	componentDidUpdate = () => {
		if(!this.state.timeToLogOut) {
			localStorage.setItem("state", JSON.stringify(this.state))
		};
	}

	handleLoginChange(login) {
		this.setState({
			login: login
		});
		this.updateLocalStorage();
	}

	handleUsernameChange(username) {
		this.setState({
			username: username
		})
	}
	
	handlePasswordChange(password) {
		this.setState({
			password: password
		})
	}

	handleProgramsChange(programs) {
		this.setState({
			programs: programs
		})
	}

	handleTrackedEntityChange(trackedEntityInstance) {
		this.setState({
			trackedEntityInstance: trackedEntityInstance
		})
	}
	
	handleEnrollementChange(enrollment) {
		this.setState({
			enrollment: enrollment
		})
	}

	handleOrgUnitChange(orgUnit) {
		this.setState({
			orgUnit: orgUnit
		})
	}

	handleChosenEventChange(event) {
		this.setState({
			chosenEvent: event
		})
		
		this.state.programs.map(program => {
			if(program.id === this.state.chosenProgram) {
				program.programStages.map(programStage => {
					if(programStage.programStage === this.state.chosenProgramStage) {
						let eventFound = false;
						programStage.events.map(stageEvent => {
							if(stageEvent.event === event.event) {
								stageEvent = event;
								eventFound = true;
							}
						})
						if(!eventFound) {
							//new event
							programStage.events.push(event);
						}
					}
				})
			}
		})

	}

	updateLocalStorage() {
		localStorage.setItem("state", JSON.stringify(this.state));
	}

	getPrograms() {
		return this.state.programs;
	}

	getChosenEvent() {
		return this.state.chosenEvent;
	}

	getState() {
		return this.state;
	}

	clearChosenEvent() {
		this.setState({
			chosenEvent: ""
		})
	}

	logOut = () => {
		this.setState({timeToLogOut:true});
		localStorage.removeItem("state");
		this.setState({login:1});
	}

	getLocalStorage() {
		if (typeof(Storage) !== "undefined") {
			let data = localStorage.getItem("state");
			if(data !== null) {
				data = JSON.parse(data);
				if(data.login !== 1) {
					this.setState({
						login: data.login,
						programs: data.programs,
						username: data.username,
						password: data.password,
						trackedEntityInstance: data.trackedEntityInstance,
						enrollment: data.enrollment,
						chosenProgram: data.chosenProgram,
						chosenEvent: data.chosenEvent,
						//TODO: Fill this up with all new state elements
					});
				} else {
					console.log("Nothing saved from local storage")
				}
			}
		} else {
			console.log("Sorry! No Web Storage support..")
		}
	}

	addToHandleSubmit(endpoint, payload, method) {
		let submit = {
			endpoint: endpoint,
			payload: payload,
			method: method,
		}

		let handleSubmit = this.state.handleSubmit;
		handleSubmit.push(submit);
		this.setState({
			handleSubmit: handleSubmit
		})
	}

	removeFromHandleSubmit(e) {
		console.log(e);
		var array = this.state.handleSubmit; 
		var index = array.indexOf(e)
		if (index !== -1) {
		  array.splice(index, 1);
		  console.log(array);
		  this.setState({handleSubmit: array});
		}

	}

	handleSubmit() {
		let que = this.state.handleSubmit;
		if(que.length > 0) {
			que.map(submitTask => {
				return api.postPayload(submitTask.endpoint, JSON.stringify(submitTask.payload), submitTask.method, this.state.username, this.state.password)
				.then(response => {
					console.log(response);
					if(response.httpStatusCode === 200) {
						this.removeFromHandleSubmit(submitTask);
					}
				})
				.catch(error => {
					console.warn('Error!', error);
				});
			})
		}
	}

	render() {
		if(this.state.login === 1) { //login screen
			return (
				<div>
					<Login
						onLoginChange={this.handleLoginChange}
						onUsernameChange={this.handleUsernameChange}
						onPasswordChange={this.handlePasswordChange}
						onProgramsChange={this.handleProgramsChange}
						updateLocalStorage={this.updateLocalStorage}
						onTrackedEntityChange={this.handleTrackedEntityChange}
						onEnrollmentChange={this.handleEnrollementChange}
						onOrgunitChange={this.handleOrgUnitChange}
						getPrograms={this.getPrograms}
					/>
				</div>
			)
		} else if (this.state.login === 2){ //waiting screen
			return (
				<div>
					<h1 className="whiteText">Loggin into Doctor's Diary</h1>
					<img src={logo} alt="loading..." />
					<button className="logout" onClick={this.logOut}>Log out</button>
				</div>
			)
		} else if (this.state.login === 3) { //register new user screen
			return (
				<div>
					<RegisterUser
						onLoginChange={this.handleLoginChange}
					/>
					<button className="logout" onClick={this.logOut}>Log out</button>
				</div>
			)
		} else if (this.state.login === 4) { //event page - register new event
			return (
				<div>
					<RegsiterTodaysEvent
						getPrograms={this.getPrograms}
						onLoginChange={this.handleLoginChange}
						onEventChange={this.handleChosenEventChange}
					/>
					<DisplayEvents
						getPrograms={this.getPrograms}
						onLoginChange={this.handleLoginChange}
						onEventChange={this.handleChosenEventChange}
					/>
					<button className="button1" onClick={this.handleSubmit}>POST changes to server</button>
					<button className="logout" onClick={this.logOut}>Log out</button>
				</div>
			)
		} else if (this.state.login === 5) { //render selected event
			return (
				<div>
					<DisplayEvent
						onLoginChange={this.handleLoginChange}
						chosenEvent = {this.getChosenEvent}
						clearChosenEvent = {this.clearChosenEvent}
						onEventChange={this.handleChosenEventChange}
						addToSubmitQue={this.addToHandleSubmit}
						getState={this.getState}
					/>
					<button className="logout" onClick={this.logOut}>Log out</button>
				</div>
			)
		} else {
			return (
				<div>
					<button onClick={() => {this.handleLoginChange(1)}}>Click me to log in</button>
					<button className="logout" onClick={this.logOut}>Log out</button>
				</div>
			)
		}
	}
}

class Login extends Component {
	handleLoginChange(e) {
		this.props.onLoginChange(e);
	}

	handleUsernameChange(e) {
		this.props.onUsernameChange(e);
	}

	handlePasswordChange(e) {
		this.props.onPasswordChange(e);
	}
	
	handleProgramsChange(e) {
		this.props.onProgramsChange(e);
	}

	handleOrgUnitChange(e) {
		this.props.onOrgunitChange(e);
	}

	handleTrackedEntityChange(e) {
		this.props.onTrackedEntityChange(e);
	}

	handleEnrollementChange(e) {
		this.props.onEnrollmentChange(e);
	}

	//TODO: Make this generic / change ID values to support doctors diary
	//checks user-login and gets data from system
  	getUserCredentialsFromLogin() {
		console.log("getUserCrendtialsFromLogin");
		let username = document.getElementById("userName").value;
		let password = document.getElementById("password").value;

		this.checkUserCredentialsFromDhis2(username, password)
			.then(response => {
				if(response) {
					this.handleLoginChange(2);
					this.handleUsernameChange(username);
					this.handlePasswordChange(password);
					this.getProgramsFromDhis2(username, password)
						.then(()=> {
						this.getUsersOrgunitFromDhis2(username, password)
						.then(() => {
						//TODO: This should be generic/ needs to be changed for the doctors diary ID
						this.getUserInfoFromDhis2("r6qGL4AmFV4", username, password)
						.then(() => {
						//TODO: This sould be genereic/ needs to be changed to the programStages of Doctors Diary proram
						this.getProgramStageDataFromDhis2("ZJ9TrNgrtfb", username, password)
						})
						})
						})
				} else {
					alert("Wrong username/password");
				}
			})
  	}

	//returns true if username/password provided is correct, if not => false
	checkUserCredentialsFromDhis2(username, password) {
		return api.checkUserCredentials(username, password)
	}

	//gets all programs from DHIS2.
	getProgramsFromDhis2(username, password) {
		console.log("getProgramsFromDhis2");
		return api.getPrograms(username, password)
			.then(data => {
				this.handleProgramsChange(data.programs)
			})
			.catch(error => {
				console.warn('Error!', error);
			});
	}

	getUsersOrgunitFromDhis2(username, password) {
		console.log("getUsersOrgunitFromDhis2");
		return api.getUsersOrgunit(username, password)
			.then(data => {
				if(data.teiSearchOrganisationUnits.length > 1) {
					alert("might not be correct orgUnit");
				}
				this.handleOrgUnitChange(data.teiSearchOrganisationUnits[0].id);
			})
			.catch(error => {
				console.warn('Error!', error);
			});
	}

	//TODO: Change name - to something like getUserData+ProgramStages
	//gets all programStages assosiated to given program.
	getUserInfoFromDhis2(programId, username, password) {
		console.log("getUserInfoFromDhis2");
		return api.getUserInfo(programId, username, password)
			.then(data => {
				console.log(data);
				let programStages = [];
				let notUpdatedTrackedEnrollemnt = true;
				data.events.map(event => {
					if(event.storedBy === username) {
						if(notUpdatedTrackedEnrollemnt) {
							notUpdatedTrackedEnrollemnt = false;
							this.handleTrackedEntityChange(event.trackedEntityInstance);
							this.handleEnrollementChange(event.enrollment);
						}
						
						let foundProgramStage = false;
						programStages.map(programStage => {
							if(programStage.programStage === event.programStage) {
								foundProgramStage = true;
								programStage.events.push({
									event: event.event,
									programStage: event.programStage,
									eventDate: event.eventDate,
									dueDate: event.dueDate,
									href: event.href,
									status: event.status,
									dataValues: event.dataValues,
								});
							}
						})
						if(!foundProgramStage) {
							programStages.push({
								programStage:event.programStage,
								events: [{
									event: event.event,
									programStage: event.programStage,
									eventDate: event.eventDate,
									dueDate: event.dueDate,
									href: event.href,
									status: event.status,
									dataValues: event.dataValues,
								}],
							});
						}
					}
				})
				let programs = this.props.getPrograms();
				if(programs.length > 0) {
					programs.map(program => {
						if(program.id === programId) {
							program.programStages = programStages;
						}
					})
				}
				console.log(programs);
				this.handleProgramsChange(programs);
			})
			.catch(error => {
				console.warn('Error!', error);
			});
	}
	
	//fills the given programStage's event's dataValues with displayName, optionSetValue (if true => optionSet as well)
	//this can only be run after function getUserInfoFromDhis2 has finished. Use .then() 
	getProgramStageDataFromDhis2(programStageId, username, password) {
		console.log("getProgramStageDataFromDhis2");
		return api.getProgramStageData(programStageId, username, password)
			.then(data => {
				console.log(data);
				let programs = this.props.getPrograms();
				if(programs.length > 0) {
					programs.map(program => {
						if(program.hasOwnProperty("programStages")) {
							program.programStages.map(programStage => {
								if(programStage.programStage === programStageId) {
									programStage.dataElements = data.programStageDataElements;
									programStage.events.map(event => {
										data.programStageDataElements.map(programStageDataElement => {
											event.dataValues.map(dataValue => {
												if(dataValue.dataElement === programStageDataElement.dataElement.id) {
													dataValue.displayName = programStageDataElement.dataElement.displayName;
													dataValue.optionSetValue = programStageDataElement.dataElement.optionSetValue;
													dataValue.valueType = programStageDataElement.dataElement.valueType;
													if(dataValue.optionSetValue) {
														dataValue.optionSet = programStageDataElement.dataElement.optionSet;
													}
												}
											})
										})
									})
								}
							})
						}
					})
				}
				console.log(programs);
				this.handleProgramsChange(programs);
				this.handleLoginChange(3);
			})
	}

	render() {
	  return (
		<article className="login">
			<h2 className="whiteText">DHIS2</h2>
			<div>
				<label className="parent">
					<p className="whiteText">Sign in</p>
					<input
						className="loginbox"
						id="userName"
						name="userName"
						type="text"
						placeholder="User name"
						defaultValue="AkselJ" //to be removed
						onChange={() => console.log("test")}
					/>
					<input
						className="loginbox"
						id="password"
						name="password"
						type="password"
						placeholder="Password"
						defaultValue="District1-" //to be removed
					/>
					<button onClick={() => this.getUserCredentialsFromLogin()} className="button1">Sign in</button>
				</label>
			</div>
		</article>
		);
	}
}

class RegisterUser extends Component {

	finishRegistering(e){
		this.props.onLoginChange(e)
	}

	render() {
		return (
			<div className="parent">
			<h1 className="whiteText">This will be a register page</h1>
			<button className="button2" onClick={() => this.finishRegistering(4)}>Finish Registering</button>
		</div>
		)
	}
	
}

class DisplayEvents extends Component {

	handleLoginChange(e) {
		this.props.onLoginChange(e);
	}

	handleChosenEventChange(e) {
		this.props.onEventChange(e);
	}

	selectEvent = event => {
		this.handleChosenEventChange(event);
		this.handleLoginChange(5);
	}
	
	render(){
		let programs = this.props.getPrograms();

		if(programs.length > 0) {
			if(programs[0].hasOwnProperty("programStages")){
				if(programs[0].programStages.length > 0) {
					let programStage = programs[0].programStages[0]; //TODO- this might need to be fixed. Map through stages?
					if(programStage.hasOwnProperty("events")) {
						return (
							<div>
								{
								programStage.events.map(event => {
									let approvalState;
			
									event.dataValues.map(dataValue => {
										if(dataValue.dataElement === "zrZADVnTtMa") { //TODO: Hardcoded approvalState dataelement
											approvalState = dataValue.value;
										}
									})
									if(approvalState === "1" || approvalState === 1) { //approved
										return <button className="buttonApproved" key={event.event} onClick={() => {this.selectEvent(event)}}>{event.eventDate.slice(0, 10)}</button>
									} else if(approvalState === "2" || approvalState === 2) { //rejected
										return <button className="buttonRejected" key={event.event} onClick={() => {this.selectEvent(event)}}>{event.eventDate.slice(0, 10)}</button>
									} else if(approvalState === "3" || approvalState === 3) { //completed, waiting for apporval
										return <button className="buttonAwaitApproval" key={event.event} onClick={() => {this.selectEvent(event)}}>{event.eventDate.slice(0, 10)}</button>
									} else {
										return <button className="button1" key={event.event} onClick={() => {this.selectEvent(event)}}>{event.eventDate.slice(0, 10)}</button>
									}
								})
								}
							</div>
						)
					} else {
						return <p>no events1</p>
					}
				} else {
					return <p>no events2</p>
				}
			} else {
				return <p>no events3</p>
			}
		} else {
			return <p>no events4</p>
		}
	}
}

class DisplayEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			changeMade: false,
		}
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}

	componentDidUpdate() {
		if(!this.state.changeMade) {
			this.setState({
				changeMade: true
			})
		}
	}

	handleLoginChange(e) {
		this.props.onLoginChange(e);
	}

	clearChosenEvent() {
		this.props.clearChosenEvent();
	}
	
	addToHandleSubmit() {
		if(this.state.changeMade) {
			let event = this.props.chosenEvent();
			let dataValues = [];
			let state = this.props.getState();
	
			event.dataValues.map(dataValue => {
				let newDataValue = {
					value: dataValue.value,
					dataElement: dataValue.dataElement,
				}
				dataValues.push(newDataValue);
			})
	
			let eventToPush = {events: [
				{
					trackedEntityInstance: state.trackedEntityInstance,
					program: state.chosenProgram,
					programStage: state.chosenProgramStage,
					enrollment: state.enrollment,
					orgUnit: state.orgUnit,
					notes: [],
					dataValues: dataValues,
					status: "ACTIVE",
					eventDate: event.eventDate.slice(0, 10),
				}
			]}

			this.props.addToSubmitQue("/events", eventToPush, "POST");
		}
	}

	registerEvent() {
		this.clearChosenEvent();
		this.addToHandleSubmit();
		this.handleLoginChange(4);
	}

	handleFieldChange(dataElement, value) {
		let event = this.props.chosenEvent();
		if(event.hasOwnProperty("dataValues")) {
			event.dataValues.map(dataValue => {
				if(dataValue.dataElement === dataElement) {
					dataValue.value = value;
					//console.log(value);
					//console.log(dataValue.value);
				}
			})
		}
		//console.log(event);
		this.handleChosenEventChange(event);
	}

	handleChosenEventChange(e) {
		this.props.onEventChange(e);
	}

	render() {
		if(this.props.chosenEvent().hasOwnProperty("dataValues")) {
			return <div className="parent">
				{this.props.chosenEvent().dataValues.map(dataValue => {
					if(dataValue.optionSetValue) {
						return <FormElement.CreateOptionElement 
							handleFieldChange={this.handleFieldChange} 
							dataValue={dataValue}
							key={dataValue.dataElement}
						/>
					} else {
						return <FormElement.CreateTextElement 
							handleFieldChange={this.handleFieldChange} 
							dataValue={dataValue}
							key={dataValue.dataElement}
						/>
					}
				})}
				<button className="test" onClick={() => this.registerEvent()}>Register form</button>
			</div>
		} else {
			return <p>nothing here</p>
		}
	}
}

//TODO: This needs fixing - does not update when registered event regsitered. Might need to update this.state in App.
class RegsiterTodaysEvent extends Component {

	handleLoginChange(e) {
		this.props.onLoginChange(e);
	}

	handleChosenEventChange(e) {
		this.props.onEventChange(e);
	}

	selectEvent = event => {
		this.handleChosenEventChange(event);
		this.handleLoginChange(5);
	}

	newEvent() {
		let event = {
			eventDate: new Date().toISOString(),
			status: "",
			dataValues: [],
		}

		let programs = this.props.getPrograms();
		if(programs.length > 0) {
			if(programs.hasOwnProperty("programStages")){
				if(programs.programStages.length > 0) {
					let programStage = programs[0].programStages[0];
					if(programStage.hasOwnProperty("dataElements")) {
						programStage.dataElements.map(dataElement => {
							if(dataElement.dataElement.optionSetValue) {
								event.dataValues.push(
									{
										dataElement: dataElement.dataElement.id,
										displayName: dataElement.dataElement.displayName,
										optionSetValue: dataElement.dataElement.optionSetValue,
										optionSet: dataElement.dataElement.optionSet,
										value: "",
									}
								)
							} else {
								event.dataValues.push(
									{
										dataElement: dataElement.dataElement.id,
										displayName: dataElement.dataElement.displayName,
										optionSetValue: dataElement.dataElement.optionSetValue,
										value: "",
									}
								)
							}
						})
					}
				}
			}
		}
		return event;
	}

	checkIfRegisteredToday() {
		let programs = this.props.getPrograms();
		let date = new Date().toISOString().slice(0, 10);

		if(programs.length > 0) {
			if(programs[0].hasOwnProperty("programStages")) {
				if(programs[0].programStages.length > 0) {
					let programStage = programs[0].programStages[0]; //TODO- this might need to be fixed. Map through stages?
					if(programStage.hasOwnProperty("events")) {
						programStage.events.map(event => {
							if(event.eventDate.slice(0, 10) === date) {
								return true;
							}
						})
					}
				}
			}
		}
		return false;
			
	}

	render() {
		if(this.checkIfRegisteredToday()) {
			return (
				<div>
					<button className="button1" onClick={console.log("already registered today")}>Todays Registered finished</button>
				</div>
			)
		} else {
			return (
				<div>
					<button className="button1" onClick={() => {this.selectEvent(this.newEvent())}}>Register Today</button>
				</div>
			)
		}
	}
}

export default App;