import React, { Component } from 'react';
import FormElement from "./FormElement";
import api from "./api.js";
import "./app.css";
import "./login.css";
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import ReactInterval from 'react-interval';
import { Offline, Online } from "react-detect-offline";


//TODO: FIX generic OU and program in /api-getUnserInfo

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
		login: 1,
		date: new Date(),
		programs: {}, //fills up from getProgramsFromDhis2
		username: "",
		password: "",
		trackedEntityInstance: "",
		enrollment: "",
		orgUnit: "",
		userId: "",
		userRole: "",
		chosenProgram: "Bv3DaiOd5Ai",
		chosenProgramStage: "",
		chosenEvent: "",
		timeToLogOut: false,
		handleSubmit: [],
		userGroups: [],
    };
	
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleLoginChange = this.handleLoginChange.bind(this);
	this.handleUsernameChange = this.handleUsernameChange.bind(this);
	this.handlePasswordChange = this.handlePasswordChange.bind(this);
	this.handleProgramsChange = this.handleProgramsChange.bind(this);
	this.updateLocalStorage = this.updateLocalStorage.bind(this);
	this.handleTrackedEntityChange = this.handleTrackedEntityChange.bind(this);
	this.handleChosenEventChange = this.handleChosenEventChange.bind(this);
	this.updateProgramsEventFromChosenEvent = this.updateProgramsEventFromChosenEvent.bind(this);
	this.handleEnrollementChange = this.handleEnrollementChange.bind(this);
	this.handleOrgUnitChange = this.handleOrgUnitChange.bind(this);
	this.handleUserIdChange = this.handleUserIdChange.bind(this);
	this.getLocalStorage = this.getLocalStorage.bind(this);
	this.getPrograms = this.getPrograms.bind(this);
	this.getState = this.getState.bind(this);
	this.getChosenEvent = this.getChosenEvent.bind(this);
	this.clearChosenEvent = this.clearChosenEvent.bind(this);
	this.addToHandleSubmit = this.addToHandleSubmit.bind(this);
	this.disableForm = this.disableForm.bind(this);
	this.setUserRole = this.setUserRole.bind(this);
	this.setUserGroups = this.setUserGroups.bind(this);

	this.setProgramStage = this.setProgramStage.bind(this);
	this.sortEventIntoColorsForCalendar = this.sortEventIntoColorsForCalendar.bind(this);
	}

	componentDidMount = () => {
		if (typeof(Storage) !== "undefined") {
			let currentUser = localStorage.getItem("currentUser");
			this.getLocalStorage(JSON.parse(currentUser))
		}
	}

	componentDidUpdate = () => {
		if(!this.state.timeToLogOut) {
			if(this.state.username !== "") {
				localStorage.setItem(this.state.username, JSON.stringify(this.state))
				localStorage.setItem("currentUser", JSON.stringify(this.state.username))
			}
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

	handleUserIdChange(userId) {
		this.setState({
			userId: userId
		})
	}

	setUserRole(userRole) {
		this.setState({
			userRole: userRole
		})
	}

	setUserGroups(userGroups) {
		this.setState({
			userGroups: userGroups
		})
	}

	handleChosenEventChange(event) {
		this.setState({
			chosenEvent: event
		})
		this.updateLocalStorage();
	}

	updateProgramsEventFromChosenEvent(event) {
		this.state.programs.map(program => {
			if(program.id === this.state.chosenProgram) {
				program.programStages.map(programStage => {
					if(programStage.programStage === this.state.chosenProgramStage) {
						let eventFound = false;
						if(!programStage.hasOwnProperty("events")){
							programStage.events = [];
						}
						programStage.events.map(stageEvent => {
							if(stageEvent.event === event.event) {
								stageEvent = event;
								eventFound = true;
								//console.log("Updated already existing event");
							}
							return Promise.resolve();
						})
						if(!eventFound) {
							console.log("created new event");
							console.log(event);
							programStage.events.push(event);
						}
					}
					return Promise.resolve();
				})
			}
			return Promise.resolve();
		})
		this.updateLocalStorage();
	}

	updateLocalStorage() {
		if(this.state.username !== ""){
			localStorage.setItem(this.state.username, JSON.stringify(this.state));
		}
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
		this.updateLocalStorage();
	}

	logOut = () => {
		//this.setState({timeToLogOut:true});
		//localStorage.removeItem(this.state.username);
		this.setState({login:1});
	}

	//TODO: Update this with all new variables added to state
	getLocalStorage(username) {
		if (typeof(Storage) !== "undefined") {
			let data = localStorage.getItem(username);
			if(data !== null) {
				data = JSON.parse(data);
				if(data.login !== 1) {
					this.setState({
						date: data.date,
						login: data.login,
						programs: data.programs,
						username: data.username,
						password: data.password,
						trackedEntityInstance: data.trackedEntityInstance,
						enrollment: data.enrollment,
						orgUnit: data.orgUnit,
						userId: data.userId,
						chosenProgram: data.chosenProgram,
						chosenProgramStage: data.chosenProgramStage,
						chosenEvent: data.chosenEvent,
						handleSubmit: data.handleSubmit,
						userRole: data.userRole,
						userGroups: data.userGroups,
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
		try {
			handleSubmit = handleSubmit.filter(handleSubmit => handleSubmit.endpoint !== submit.endpoint);
		} catch (error) {
			console.log(error);
		}
		//const result = words.filter(word => word.length > 6);

		handleSubmit.push(submit);

		this.setState({
			handleSubmit: handleSubmit
		})
		this.updateLocalStorage();
	}

	removeFromHandleSubmit(e) {
		var array = this.state.handleSubmit; 
		var index = array.indexOf(e)
		if (index !== -1) {
		  array.splice(index, 1);
		  this.setState({handleSubmit: array});
		}
	}

	//adds href, event ID and programStage to event that's been POSTed.
	updateEventAfterSubmit(href, event) {
		let splitHref = href.split("/");
		let eventId = splitHref[splitHref.length-1];
		let programs = this.state.programs;
		programs.map(program => {
			if(program.id === this.state.chosenProgram) {
				program.programStages.map(programStage => {
					if(programStage.programStage === this.state.chosenProgramStage) {
						programStage.events.map(stageEvent => {
							if(stageEvent.eventDate === event.events[0].eventDate) {
								stageEvent.href = href;
								stageEvent.event = eventId;
								stageEvent.programStage = event.events[0].programStage;
							}
							return Promise.resolve();
						})
					}
					return Promise.resolve();
				})
			}
			return Promise.resolve();
		})
		this.setState({
			programs: programs
		})
	}

	handleSubmit() {
		let que = this.state.handleSubmit;
		if(que.length > 0) {
			que.map(submitTask => {
				console.log("Perfoming + " + submitTask.method);
				return api.postPayload(submitTask.endpoint, JSON.stringify(submitTask.payload), submitTask.method, this.state.username, this.state.password)
				.then(response => {
					if(response.httpStatusCode === 200) {
						console.log(response);
						this.removeFromHandleSubmit(submitTask);
						try {
							if(submitTask.method === "POST") {
								this.updateEventAfterSubmit(response.response.importSummaries[0].href, submitTask.payload);
							}
						} catch(e) {
							console.log("Error: " + e);
						}
					}
				})
				.catch(error => {
					console.warn('Error!', error);
				});
			})
		}	
	}

	//used to fill calendar with dates in colors corresponding to their approval status
	sortEventIntoColorsForCalendar() {
		let datesRed = [];
		let datesGreen = [];
		let datesBlue = [];
		try {
			this.state.programs.map(program => {
				if(program.id === this.state.chosenProgram) {
					program.programStages.map(programStage => {
						if(programStage.programStage === this.state.chosenProgramStage) {
							programStage.events.map(event => {
								event.dataValues.map(dataValue => {
									if(dataValue.dataElement === "OZUfNtngt0T") {
										if(dataValue.value === "Approved") {
											//put date into datesGreen
											datesGreen.push({startDate: Date.parse(this.setDateToOneDayEarlier(event.eventDate.split('T')[0])), endDate: Date.parse(event.eventDate.split('T')[0])});
										} else if(dataValue.value === "Auto-Approved") {
											//put date into datesGreen
											datesGreen.push({startDate: Date.parse(this.setDateToOneDayEarlier(event.eventDate.split('T')[0])), endDate: Date.parse(event.eventDate.split('T')[0])});
										} else if(dataValue.value === "Rejected") {
											//put date into datesRed
											datesRed.push({startDate: Date.parse(this.setDateToOneDayEarlier(event.eventDate.split('T')[0])), endDate: Date.parse(event.eventDate.split('T')[0])});
										} else if(dataValue.value === "Re-submitted") {
											//put date into datesBlue
											datesBlue.push({startDate: Date.parse(this.setDateToOneDayEarlier(event.eventDate.split('T')[0])), endDate: Date.parse(event.eventDate.split('T')[0])});
										}
									}
								})
							})
						}
					})
				}
			})
		} catch (error) {
			//console.log(error);
		}
		return [datesRed, datesGreen, datesBlue]
	}

	//takes in date in "yyyy-mm-dd" format and set the date the day before.
	setDateToOneDayEarlier(date) {
		let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //ignoring leap year...
		date = date.split('-').map(i => parseInt(i));
		if(date[2].toString() === "01" || date[2] === 1){
			date[2] = daysInMonth[date[1]-1];
			if(date[1].toString() === "01" || date[1] === 1) {
				date[1] = 12;
				date[0] = date[0]-1;
			}
		} else {
			date[2] = date[2]-1;
		}
		date = date.join("-");
		return date;
	}

	//TODO: make generic - get ID from userRoles?
	setProgramStage() {
		console.log("Setting programStage");
		//id = programStage ID.
		//code = static code found in userGroups 
		let programStages = [
			{code: "Doctor_Diary_Anaethetist", id: "anSbnUqRxeR"},
			{code: "Doctor_Diary_Cardiology", id: "vzgsME7gBw1"},
			{code: "Doctor_Diary_Chest_Disease", id: "hLtWNeAwwKU"},
			{code: "Doctor_Diary_Ent_Specialist", id: "Z053EH826P6"},
			{code: "Doctor_Diary_Gynnacologist", id: "CLoZpOqTSI8"},
			{code: "Doctor_Diary_Medicine_Specialist", id: "qYk6poPj1d5"},
			{code: "Doctor_Diary_Nephrology", id: "wi7IoJCW1Hm"},
			{code: "Doctor_Diary_Neuro_Surgery_Specialist", id: "mVDFt1JK21P"},
			{code: "Doctor_Diary_Opthamologist", id: "FkNlQ5arLjv"},
			{code: "Doctor_Diary_Orthopaedics", id: "paJ6xmM0NKb"},
			{code: "Doctor_Diary_Pediatrician", id: "GY3DLFAuERf"},
			{code: "Doctor_Diary_Radiologist", id: "bZtzNBFba8z"},
			{code: "Doctor_Diary_Skin_and_Venereal_Disease", id: "DVmD2rzLJ5E"},
			{code: "Doctor_Diary_Surgeon", id: "ZVuW1ToOfyG"},
			{code: "Doctor_Diary_Urology", id: "ugXqDTZBeKt"}
		];
		let userGroups = [];
		userGroups = this.state.userGroups;
		console.log(userGroups);
		userGroups.map(userGroup => {
			if(userGroup.hasOwnProperty("code")) {
				programStages.map(programStage => {
					if(userGroup.code === programStage.code) {
						this.setState({
							chosenProgramStage: programStage.id
						})
						console.log("chosenProgramStage: " + programStage.id);
					}
				})
			}
		})
		this.updateLocalStorage();
	}

	//Returns date one day before the first recorded event. 
	eventsFirstDate() {
		let lastEvent = "0000-00-00";
		let firstEvent = "9999-12-30";
		try {
			this.state.programs.map(program => {
				if(program.id === this.state.chosenProgram) {
					program.programStages.map(programStage => {
						if(programStage.programStage === this.state.chosenProgramStage) {
							programStage.events.map(event => {
								if(event.eventDate.slice(0,10) > lastEvent) {
									lastEvent = event.eventDate.slice(0,10);
								}
								if(event.eventDate.slice(0,10) < firstEvent) {
									firstEvent = event.eventDate.slice(0,10);
								}
								return Promise.resolve();
							})
						}
						return Promise.resolve();
					})
				}
				return Promise.resolve();
			})
		} catch (error) {
			console.log(error);
		}

		if(firstEvent === "9999-12-30") {
			let d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;
	
			firstEvent = [year, month, day].join('-');
		}

		let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //ignoring leap year...
		let intDate = firstEvent.split('-').map(i => parseInt(i));
		if(intDate[2].toString() === "01" || intDate[2] === 1){
			intDate[2] = daysInMonth[intDate[1]-1];
			if(intDate[1].toString() === "01" || intDate[1] === 1) {
				intDate[1] = 12;
				intDate[0] = intDate[0]-1;
			}
		} else {
			intDate[2] = intDate[2]-1;
		}
		firstEvent = intDate.join("-");

		//console.log(firstEvent);
		return firstEvent;
	}

	//returns event if there is an event for given date
	findEventBasedOnSelectedDate() {
		let chosenEvent = "";
		try {
			let selectedDate = JSON.stringify(this.state.date[0]).slice(1,11);
			this.state.programs.map(program => {
				if(program.id === this.state.chosenProgram) {
					program.programStages.map(programStage => {
						if(programStage.programStage === this.state.chosenProgramStage) {
							programStage.events.map(event => {
								if(selectedDate === event.eventDate.slice(0,10)){
									chosenEvent = event;
								}
								return Promise.resolve();
							})
						}
						return Promise.resolve();
					})
				}
				return Promise.resolve();
			})
		} catch (error) {
			console.log(error);
		}
		return chosenEvent;
	}

	newEvent() {
		let event = {
			eventDate: this.state.date[0].toISOString().slice(0,23),
			status: "",
			dataValues: [],
		}

		let programs = this.state.programs;
		if(programs.length > 0) {
			programs.map(program => {
				if(program.id === this.state.chosenProgram) { //TODO - not hardcode - this is specified in state.
					if(program.hasOwnProperty("programStages")){
						if(program.programStages.length > 0) {
							let programStage = program.programStages[0]; //TODO: This cannot be.. if there is more than one programStage.
							if(programStage.hasOwnProperty("dataElements")) {
								if(programStage.dataElements.length > 0) {
								programStage.dataElements.map(dataElement => {
										if(dataElement.dataElement.optionSetValue) {
											if(dataElement.dataElement.id === "OZUfNtngt0T") { //approval status
												event.dataValues.push(
													{
														dataElement: dataElement.dataElement.id,
														displayName: dataElement.dataElement.displayName,
														optionSetValue: dataElement.dataElement.optionSetValue,
														optionSet: dataElement.dataElement.optionSet,
														value: "Re-submitted",
													}
												)
											} else {
												event.dataValues.push(
													{
														dataElement: dataElement.dataElement.id,
														displayName: dataElement.dataElement.displayName,
														optionSetValue: dataElement.dataElement.optionSetValue,
														optionSet: dataElement.dataElement.optionSet,
														value: "",
													}
												)
											}

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
										return Promise.resolve();
									})
								}
							}
						}
					}
				}
				return Promise.resolve();
			})
		}
		return event;
	}


	setChosenEventFromCalenderView() {
		let event = this.findEventBasedOnSelectedDate();
		if(event !== "") {
			this.handleChosenEventChange(event);
		} else {
			let newEvent = this.newEvent();
			this.handleChosenEventChange(newEvent);
			//todo: create new event
			//this.clearChosenEvent();
		}
		this.disableForm();
	}

	//Only way of removing the time-picker from the calendar..
	removeTimer() {
		try {
			var el = document.querySelector( '.flatpickr-time' );
			el.parentNode.removeChild( el );
		} catch (error) {
			
		}
	}


	//disables all form-elements, as long as their className="item-select".
	disableForm() {
		let todaysDate = new Date().toISOString().split('T')[0].split('-').map(i => parseInt(i));
		let selectedDate = this.state.date[0];

		try {
			selectedDate = selectedDate.split('T')[0].split('-').map(i => parseInt(i));	
		} catch (error) {
			selectedDate = selectedDate.toISOString().split('T')[0].split('-').map(i => parseInt(i));
		}

		let daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //ignoring leap year...
		let selectedDateValue = daysInMonth[selectedDate[1]] + selectedDate[2];
		let todaysDateValue = daysInMonth[todaysDate[1]] + todaysDate[2];
	
		if(todaysDateValue - selectedDateValue > 7) { //DISABLE if 7 days difference
			let elements = document.getElementsByClassName("item-select");
			for (let i = 0; i < elements.length; i++) {
				elements[i].setAttribute("disabled", true);
			}
		} else {
			let elements = document.getElementsByClassName("item-select");
			for (let i = 0; i < elements.length; i++) {
				elements[i].removeAttribute("disabled");
			}
		}
	}

	render() {		
		const { date } = this.state;
		if(this.state.login === 1) { //login screen
			return (
				<div className="loginScreen">
					<Login
						onLoginChange={this.handleLoginChange}
						onUsernameChange={this.handleUsernameChange}
						onPasswordChange={this.handlePasswordChange}
						onProgramsChange={this.handleProgramsChange}
						updateLocalStorage={this.updateLocalStorage}
						onTrackedEntityChange={this.handleTrackedEntityChange}
						onEnrollmentChange={this.handleEnrollementChange}
						onOrgunitChange={this.handleOrgUnitChange}
						onUserIdChange={this.handleUserIdChange}
						getPrograms={this.getPrograms}
						getState={this.getState}
						choseSpecialst={this.setProgramStage}
						setUserRole={this.setUserRole}
						getLocalStorage={this.getLocalStorage}
						setUserGroups={this.setUserGroups}
					/>
				</div>
			)
		} else if (this.state.login === 2){ //waiting screen
			return (
				<div>
					<h1 className="whiteText">Loggin into Doctor's Diary</h1>
					{//<img className="logo" src={logo} alt="loading..." />
					}
					<button className="logout" onClick={this.logOut}>Log out</button>
				</div>
			)
		} else if (this.state.login === 3) { //register new user screen
		} else if (this.state.login === 4) { //event page - register new event

			let test = [[],[],[]];
			test = this.sortEventIntoColorsForCalendar();
			let datesRed = test[0];
			let datesGreen = test[1];
			let datesBlue = test[2];

			return (
				<div>
					<ReactInterval timeout={5000} enabled={true}
						callback={() => this.handleSubmit()} 
					/>

					<Online>
						<header className="header-online">
							<p className="whiteText-1" id="top-margin">ONLINE - TO SEND: {this.state.handleSubmit.length} - {this.state.username}</p>	
						</header>			
					</Online>

					<Offline>
						<header className="header-offline">
							<p className="whiteText-1" id="top-margin">OFFLINE - TO SEND: {this.state.handleSubmit.length} - {this.state.username}</p>
						</header>
					</Offline>

					<div className="calenderAndEvents">
						<Flatpickr data-enable-time
							value={date}
							onClick={this.removeTimer}
							onChange={date => { this.setState({date}); this.setChosenEventFromCalenderView(); }}
							options={
								{
								onDayCreate: function(dObj, dStr, fp, dayElem){
									let curDate = +dayElem.dateObj;
									datesRed.map(date => {
										if (curDate >= date.startDate && curDate <= date.endDate) {
										dayElem.className += "cool-date-red";
										}
										return Promise.resolve();
									})

									datesGreen.map(date => {
										if (curDate >= date.startDate && curDate <= date.endDate) {
										dayElem.className += "cool-date-green";
										}
										return Promise.resolve();
									})

									datesBlue.map(date => {
										if (curDate >= date.startDate && curDate <= date.endDate) {
										dayElem.className += "cool-date-yellow";
										}
										return Promise.resolve();
									})

								},
								disable: [
									{
										from: "0000-01-01",
										to: this.eventsFirstDate(),
									},
									{
										from: new Date().fp_incr(1),
										to: "2018-15-1000"
									}
								],
								locale: {
									"firstDayOfWeek": 1 // start week on Monday
								//add inline:true to always show calendar
								},
								time_24hr:true,
								dateFormat: "Y-m-d"
								}
								//<button onClick={() => this.eventsFirstDate()}>click me</button>

							}
						/>
						<DisplayEvent
							onLoginChange={this.handleLoginChange}
							chosenEvent = {this.getChosenEvent}
							clearChosenEvent = {this.clearChosenEvent}
							onEventChange={this.handleChosenEventChange}
							addToSubmitQue={this.addToHandleSubmit}
							getState={this.getState}
							updateProgramsEventFromChosenEvent={this.updateProgramsEventFromChosenEvent}
						/>
						<button className="logout" onClick={() => { if (window.confirm('Are you sure you want to log out?\nYou have ' + this.state.handleSubmit.length + " reports pending..")) this.logOut() } }>Log out</button>
					</div>
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

	handleUserIdChange(e) {
		this.props.onUserIdChange(e);
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
					this.props.getLocalStorage(username);
					this.handleLoginChange(2);
					this.handleUsernameChange(username);
					this.handlePasswordChange(password);
					this.getProgramsFromDhis2(username, password)
						.then(()=> {
						this.props.choseSpecialst();
						this.getUsersOrgunitFromDhis2(username, password)
						.then(data => {
						this.getEnrollmentAndTrackedEntityData(this.props.getState().orgUnit, this.props.getState().chosenProgram, username, password)
						.then(() => {						
						//TODO: This should be generic/ needs to be changed for the doctors diary ID
						this.getUserInfoFromDhis2(this.props.getState().chosenProgram, username, password) //programID, username, password
						.then(() => {
						//TODO: This sould be genereic/ needs to be changed to the programStages of Doctors Diary proram
						this.getProgramStageDataFromDhis2(this.props.getState().chosenProgramStage, username, password)
						})
						})
						})
						})	
				} else {
					//alert("Wrong username/password");
				}
			})
  	}

	//returns true if username/password provided is correct, if not => false
	checkUserCredentialsFromDhis2(username, password) {
		return api.checkUserCredentials(username, password)
		.then(respons => {
			if(!respons) {
				if (typeof(Storage) !== "undefined") {
					let data = localStorage.getItem(username);
					if(data !== null) {
						data = JSON.parse(data);
						if(username === data.username && password === data.password) {
							this.props.getLocalStorage(username);
							this.handleLoginChange(4);
							return false;
						} else {
							alert("Wrong username/password");
						}
					} else {
						alert("Wrong username/password");
					}
				}
			} else {
				return respons;
			}
		})
	}

	//gets all programs from DHIS2.
	getProgramsFromDhis2(username, password) {
		console.log("getProgramsFromDhis2");
		return api.getPrograms(username, password, this.props.getState().chosenProgram)
			.then(data => {
				this.handleProgramsChange(data.programs)
			})
			.catch(error => {
				console.warn('Error!', error);
			});
	}

	//gets organisation unit id and user id 
	getUsersOrgunitFromDhis2(username, password) {
		console.log("getUsersOrgunitFromDhis2");
		return api.getUsersOrgunit(username, password)
			.then(data => {
				this.props.setUserGroups(data.userGroups);
				this.props.setUserRole(data.userCredentials.userRoles[0].id)
				this.handleUserIdChange(data.id);
				this.handleOrgUnitChange(data.organisationUnits[0].id);
				return data;
			})
			.catch(error => {
				console.warn('Error!', error);
			});
	}

	getEnrollmentAndTrackedEntityData(orgUnit, programId, username, password) {
		console.log("getEnrollmentAndTrackedEntityData");
		return api.getEnrollmentAndTrackedED(orgUnit, programId, username, password)
			.then(data => {
				//console.log(data);
				try {
					this.handleTrackedEntityChange(data.trackedEntityInstances[0].trackedEntityInstance);
					this.handleEnrollementChange(data.trackedEntityInstances[0].enrollments[0].enrollment);
				} catch (e) {
					console.log(e)
				}
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
				let foundEvent = false;
				let programStages = [];
				data.events.map(event => {
					if(event.storedBy === username) {
						foundEvent = true;
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
							return Promise.resolve();
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
					return Promise.resolve();
				})

				if(!foundEvent && data.events.length > 0) {
					programStages.push({
						programStage:data.events[0].programStage,
						events: [],
					})
				}

				let programs = this.props.getPrograms();
				if(programs.length > 0) {
					programs.map(program => {
						if(program.id === programId) {
							program.programStages = programStages;
						}
						return Promise.resolve();
					})
				}
				//console.log(programs);
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
				let programs = this.props.getPrograms();
				if(programs.length > 0) {
					programs.map(program => {
						if(program.hasOwnProperty("programStages")) { //TODO: needs changing if you want to add monthly event as well.
							if(program.programStages.length === 0) {
								program.programStages.push({
									dataElements: data.programStageDataElements,
									programStage: data.id,
									displayName: data.displayName,
									name: data.name,
								});
								//TODO: add programStage with data here. 
							} else {
								program.programStages.map(programStage => {
									programStage.dataElements = data.programStageDataElements;
									programStage.displayName = data.displayName;
									programStage.name = data.name;
									if(programStage.programStage === programStageId) {
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
													return Promise.resolve();
												})
												return Promise.resolve();
											})
											return Promise.resolve();
										})
									}
									return Promise.resolve();
								})
							}
						}
						return Promise.resolve();
					})
				}
				//console.log(programs);
				this.handleProgramsChange(programs);
				this.handleLoginChange(4); //TODO: set to "3" to register user
			})
	}

	render() {
	  return (
		<article>
			<h2 className="loginText">DHIS2</h2>
			<div>
				<label className="parent-column">
					<p className="Sign-in">Sign in</p>
					<input
						className="loginbox"
						id="userName"
						name="userName"
						type="text"
						placeholder="User name"
						//defaultValue="testan" //to be removed
					/>
					<input
						className="loginbox"
						id="password"
						name="password"
						type="password"
						placeholder="Password"
						//defaultValue="Test@1234" //to be removed
					/>
						<a className="forgot-password" href="https://uphmis.in/uphmis/dhis-web-commons/security/recovery.action">Forgot your password?</a>
					<button onClick={() => this.getUserCredentialsFromLogin()} className="button1">Sign in</button>
				</label>
			</div>
		</article>
		);
	}
}

class DisplayEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			changeMade: false,
			enableEdit: true,
			approvedStatus: false,
		}
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}

	componentDidUpdate() {
		if(!this.state.changeMade) {
			this.setState({
				changeMade: true
			})
		}
		this.checkAprovalStatusForApproved();
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
				if(dataValue.dataElement === "OZUfNtngt0T") { //approvalStatus -> set to Re-submitted after sending
					newDataValue.value = "Re-submitted";
				}

				dataValues.push(newDataValue);
				return Promise.resolve();
			})

			if(event.hasOwnProperty("event")) {
				//EVENT exists from before, and needs PUT
				let eventToPush = {
						event: event.event,
						program: state.chosenProgram,
						programStage: state.chosenProgramStage,
						status: "COMPLETED",
						trackedEntityInstance: state.trackedEntityInstance,
						dataValues: dataValues,
					}

				this.props.addToSubmitQue(`/events/${event.event}`, eventToPush, "PUT");
			
			} else {
				//EVENT does not exists from before, and needs POST
				let eventToPush = {events: [
					{
						trackedEntityInstance: state.trackedEntityInstance,
						program: state.chosenProgram,
						programStage: state.chosenProgramStage,
						enrollment: state.enrollment,
						orgUnit: state.orgUnit,
						notes: [],
						dataValues: dataValues,
						status: "COMPLETED",
						eventDate: event.eventDate,
					}
				]}

				this.props.addToSubmitQue("/events", eventToPush, "POST");
			}
		}
		this.clearChosenEvent();
	}

	registerEvent() {
		this.props.updateProgramsEventFromChosenEvent(this.props.chosenEvent());
		this.addToHandleSubmit();
		this.handleLoginChange(4);
	}

	handleFieldChange(dataElement, value) {
		let event = this.props.chosenEvent();
		if(event.hasOwnProperty("dataValues")) {
			event.dataValues.map(dataValue => {
				if(dataValue.dataElement === dataElement) {
					dataValue.value = value;
					if(dataValue.dataElement === "x2uDVEGfY4K") {
						if(value === "Working") {
							this.setState({enableEdit:true})
						} else {
							this.setState({enableEdit:false})
						}
					}
				}
				return Promise.resolve();
			})
		}

		//this ensures that all optionSets are selected, even if not clicked.
		//default view in optionSets are value=1, so unless changed by user,
		//the value stays 1.
		event.dataValues.map(value => {
			if(value.dataElement === "OZUfNtngt0T") {//approval status
				if(value.value === "") {
					value.value = "Re-submitted";
				}
			} else if (value.dataElement === "x2uDVEGfY4K") {//working status
				if(value.value === "") {
					value.value = "Working";
				}	
			}
			return Promise.resolve();
		})
		this.props.onEventChange(event);
	}

	enableForm() {
		return this.state.enableEdit;
	}

	checkAprovalStatusForApproved() { //if approved - do not edit any element.
		if(!this.state.approvedStatus){
			try {
				this.props.chosenEvent().dataValues.map(dataValue => {
					if(dataValue.dataElement === "OZUfNtngt0T") {
						if(dataValue.value === "Approved") {
							this.setState({approvedStatus:true})
						}
					}
				})	
			} catch (error) {
				console.log(error);
			}
		}
	}

	render() {
		if(this.props.chosenEvent().hasOwnProperty("dataValues")) {
		this.checkAprovalStatusForApproved();
		return <div className="displayEvents">
				{
				this.props.chosenEvent().dataValues.map(dataValue => {
					let inputmode = "text";
					if(dataValue.valueType === "NUMBER") {
						inputmode = "numeric";
					}

					//render elements and disable possiblibilty of editing.
					if(this.state.approvedStatus) {
						if(dataValue.optionSetValue) {
							return <FormElement.CreateOptionElement 
								handleFieldChange={""}
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
							/>
						} else {
							return <FormElement.CreateElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
								inputmode={inputmode}
							/>	
						}
						//else if - if working status = "working" -> enable editing
					} else if(this.state.enableEdit) {
						if(dataValue.optionSetValue) {
							if(dataValue.dataElement === "OZUfNtngt0T") { //approval status - not to be changed
								return <FormElement.CreateOptionElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
							/>
							} else if(dataValue.dataElement === "CCNnr8s3rgE") { //reason for rejection
								//dont render...
							} else {
								return <FormElement.CreateOptionElement 
								handleFieldChange={this.handleFieldChange}
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={true}
							/>
							}
						} else {
							return <FormElement.CreateElement 
								handleFieldChange={this.handleFieldChange} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={true}
								inputmode={inputmode}
							/>
						}
						//else - working status !== "working" -> disale edit
					} else {
						if(dataValue.optionSetValue) {
							if(dataValue.dataElement === "OZUfNtngt0T") { //approval status - not to be changed
								return <FormElement.CreateOptionElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
							/>
							} else if(dataValue.dataElement === "CCNnr8s3rgE") { //reason for rej
								//dont render...
							} else if(dataValue.dataElement === "x2uDVEGfY4K") { //working status
								return <FormElement.CreateOptionElement 
									handleFieldChange={this.handleFieldChange}
									dataValue={dataValue}
									key={dataValue.dataElement}
									enableEditForm={true}
								/>
							} else {
								return <FormElement.CreateOptionElement 
									handleFieldChange={""} 
									dataValue={dataValue}
									key={dataValue.dataElement}
									enableEditForm={false}
								/>	
							}
						} else {
								return <FormElement.CreateElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
								inputmode={inputmode}
							/>
						}


						/*
						if(dataValue.dataElement === "OZUfNtngt0T") { //approval status - not to be changed
							return <FormElement.CreateOptionElement 
							handleFieldChange={this.handleFieldChange} //remove?
							dataValue={dataValue}
							key={dataValue.dataElement}
							enableEditForm={false}
						/>
						} 
						*/
					}
				})
				}
				<button className="send-report-button" onClick={() => this.registerEvent()}>Send Report</button>
				<button className="send-report-button" onClick={() => { this.handleLoginChange(4); this.clearChosenEvent();}}>Back</button>
			</div>
		} else {
			return <p className="whiteText-1">Select event from calendar</p>
		}
	}
}

/*
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
			eventDate: new Date().toISOString(), //GET date from calender
			status: "",
			dataValues: [],
		}

		let programs = this.props.getPrograms();
		if(programs.length > 0) {
			programs.map(program => {
				if(program.id === "Bv3DaiOd5Ai") { //TODO - not hardcode - this is specified in state.
					if(program.hasOwnProperty("programStages")){
						if(program.programStages.length > 0) {
							let programStage = program.programStages[0]; //TODO: This cannot be.. if there is more than one programStage.
							if(programStage.hasOwnProperty("dataElements")) {
								if(programStage.dataElements.length > 0) {
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
										return Promise.resolve();
									})
								}
							}
						}
					}
				}
				return Promise.resolve();
			})
		}
		//console.log(event);
		return event;
	}

	//TODO: FIX this
	checkIfRegisteredToday() {
		let programs = this.props.getPrograms();
		let date = new Date().toISOString().slice(0, 10);

		if(programs.length > 0) {
			//console.log("1");
			if(programs[0].hasOwnProperty("programStages")) {
				//console.log("2");
				if(programs[0].programStages.length > 0) {
					//console.log("3");
					let programStage = programs[0].programStages[0]; //TODO- this might need to be fixed. Map through stages?
					if(programStage.hasOwnProperty("events")) {
						//console.log("4");
						programStage.events.map(event => {
							//console.log("5");
							if(event.eventDate.slice(0, 10) === date) {
								//console.log("6");
								return true;
							}
							return Promise.resolve();
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
					<button onClick={() => {this.selectEvent(this.newEvent())}}>Register Today</button>
				</div>
			)
		}
	}
}
*/

export default App;