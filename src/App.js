import React, { Component } from 'react';
import api from "./api.js";
import Login from './components/Login';
import DisplayEvent from './components/DisplayEvent';
import Flatpickr from 'react-flatpickr';
import ReactInterval from 'react-interval';
import { Offline, Online } from "react-detect-offline";

import "./App.css";
import 'flatpickr/dist/themes/light.css';


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
				this.setState({
					login: 4
				})
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
				//testing the submit-function. if post - removes before fetching.
				if(submitTask.method === "POST") {
					console.log("Stopped POST");
					console.log(submitTask);
					this.removeFromHandleSubmit(submitTask);
				}
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

		let approvalStatusFound = false;

		try {
			this.state.programs.map(program => {
				if(program.id === this.state.chosenProgram) {
					program.programStages.map(programStage => {
						if(programStage.programStage === this.state.chosenProgramStage) {
							programStage.events.map(event => {
								event.dataValues.map(dataValue => {
									if(dataValue.dataElement === "OZUfNtngt0T") {
										approvalStatusFound = true;
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
									return Promise.resolve();
								})
								if(!approvalStatusFound) {
									datesBlue.push({startDate: Date.parse(this.setDateToOneDayEarlier(event.eventDate.split('T')[0])), endDate: Date.parse(event.eventDate.split('T')[0])});
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
		userGroups.map(userGroup => {
			if(userGroup.hasOwnProperty("code")) {
				programStages.map(programStage => {
					if(userGroup.code === programStage.code) {
						this.setState({
							chosenProgramStage: programStage.id
						})
						console.log("chosenProgramStage: " + programStage.id);
					}
					return Promise.resolve();
				})
			}
			return Promise.resolve();
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
	//also disables keyboard prompt on mobile when clicking calendar
	removeTimer() {
		try {
			let el = document.querySelector( '.flatpickr-time' );
			el.parentNode.removeChild( el );
		} catch (error) {}

		try {
			let x = document.getElementsByTagName("span");
			for (let i = 0; i < x.length; i++) {
				if(x[i].className.includes("day")){
					x[i].setAttribute("readonly", true);
				}
			}
		} catch (error) {}

		try {
			let x = document.getElementsByClassName("flatpickr-days");
			x[0].setAttribute("readonly", true);
		} catch (error) {}

		try {
			let x = document.getElementsByClassName("dayContainer");
			x[0].setAttribute("readonly", true);
		} catch (error) {}
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
						//callback={() => this.handleSubmit()} 
					/>

					<Online>
						<header className="header-online" id="parent-row">
							<p className="whiteText-1">ONLINE</p>
							<p className="whiteText-1">Reports to send: {this.state.handleSubmit.length}</p>
							<p className="whiteText-1">User: {this.state.username}</p>
							<button id="logout" onClick={() => {
							if(this.state.handleSubmit.length > 0) {
								if(window.confirm('Are you sure you want to log out?\nYou have ' + this.state.handleSubmit.length + " reports pending.."))
										 this.logOut()
							} else {
								this.logOut()
							}
						}
						}
						>Log out
						</button>
						</header>			
					</Online>

					<Offline>
					<header className="header-offline" id="parent-row">
							<p className="whiteText-1">OFFLINE</p>
							<p className="whiteText-1">Reports to send: {this.state.handleSubmit.length}</p>
							<p className="whiteText-1">User: {this.state.username}</p>
							<button id="logout" onClick={() => {
							if(this.state.handleSubmit.length > 0) {
								if(window.confirm('Are you sure you want to log out?\nYou have ' + this.state.handleSubmit.length + " reports pending.."))
										 this.logOut()
							} else {
								this.logOut()
							}
						}
						}
						>Log out
						</button>
						</header>	
					</Offline>

					<div className="calenderAndEvents">
						<p className="whiteText-2">Select date: </p>
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
								dateFormat: "Y-m-d",
								}
								//<button onClick={() => this.eventsFirstDate()}>click me</button>

							}
						/>
					</div>
					<div className="displayEventsFromApp">
					<DisplayEvent
							onLoginChange={this.handleLoginChange}
							chosenEvent = {this.getChosenEvent}
							clearChosenEvent = {this.clearChosenEvent}
							onEventChange={this.handleChosenEventChange}
							addToSubmitQue={this.addToHandleSubmit}
							getState={this.getState}
							updateProgramsEventFromChosenEvent={this.updateProgramsEventFromChosenEvent}
						/>
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

export default App;