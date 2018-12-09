import React, { Component } from 'react';
import "./login.css";
import api from "../api.js";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {}
		this.getUserCredentialsFromLogin = this.getUserCredentialsFromLogin.bind(this);
	}

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

		this.handleLoginChange(2);

		this.checkUserCredentialsFromDhis2(username, password)
			.then(response => {
				if(response) {
						this.props.getLocalStorage(username);
						this.handleUsernameChange(username);
						this.handlePasswordChange(password);
						this.getProgramsFromDhis2(username, password)
							.then(()=> {
							this.getUsersOrgunitFromDhis2(username, password)
							.then(data => {
							this.props.setProgramStage();
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
					this.handleLoginChange(1);
					let x = document.getElementById("failed-login");
					x.innerHTML = "Wrong username/password";
				}
			})
  	}

	//returns true if username/password provided is correct, if not => false
	checkUserCredentialsFromDhis2(username, password) {
		return api.checkUserCredentials(username, password)
		.then(respons => {
			return respons;
			/*
			if(!respons) {
				this.handleLoginChange(1);
				if (typeof(Storage) !== "undefined") {
					let data = localStorage.getItem(username);
					if(data !== null) {
						data = JSON.parse(data);
						if(username === data.username && password === data.password) {
							this.props.getLocalStorage(username);
							return 1;
						} else {
							let x = document.getElementById("failed-login");
							x.innerHTML = "Wrong username/password";
							//alert("Wrong username/password");
						}
					} else {
						let x = document.getElementById("failed-login");
						x.innerHTML = "Wrong username/password";
						//alert("Wrong username/password");
					}
				}
			} else {
				return respons;
			}
			*/
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
				this.handleProgramsChange(programs);
				this.handleLoginChange(4); //TODO: set to "3" to register user
			})
	}

	handleKeyPress(e) {
		if (e.key === 'Enter') {
			this.getUserCredentialsFromLogin();
		}
	}

	render() {
	  return (
		<article>
			<h2 className="loginText">DHIS2</h2>
			<div>
				<label className="parent-column">
					<p className="Sign-in">Sign in</p>
					<p id="failed-login"></p>
					<input
						className="loginbox"
						id="userName"
						name="userName"
						type="text"
						placeholder="User name"
					/>
					<input
						className="loginbox"
						id="password"
						name="password"
						type="password"
						placeholder="Password"
						onKeyPress={e => this.handleKeyPress(e)}
					/>
					<a className="forgot-password" href="https://uphmis.in/uphmis/dhis-web-commons/security/recovery.action">Forgot your password?</a>
					<button onClick={() => this.getUserCredentialsFromLogin()} className="button1">Sign in</button>
				</label>
			</div>
		</article>
		);
	}
}

export default Login;