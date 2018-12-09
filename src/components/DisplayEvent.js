import React, { Component } from 'react';
import FormElement from "./FormElement";

class DisplayEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			changeMade: false,
			enableEdit: true,
			approvedStatus: "",
		}
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}
/*
	componentWillMount() {
		this.setState({approvedStatus:false})
	}
	componentDidMount() {
		this.setState({approvedStatus:false})
	}

*/

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
		this.setState({approvedStatus:false})
		this.props.clearChosenEvent();
	}
	
	addToHandleSubmit() {
		if(this.state.changeMade) {

			let event = this.props.chosenEvent();
			let dataValues = [];
			let state = this.props.getState();


			//iterate handleSubmitQue and remove this event, before making changes, and adding it again
			try {
				state.handleSubmit.map(submit => {
					//console.log(submit.payload.events[0].eventDate.slice(0,10));
					//console.log(event.eventDate.slice(0,10));
					if(submit.payload.events[0].eventDate.slice(0,10) === event.eventDate.slice(0,10)) {
						//Delete submit from handleSubmit
						console.log("deleting")
						this.props.removeFromHandleSubmit(submit);
					} else {
						console.log("nothing found")
					}
				})	
			} catch (error) {
				
			}



			let approvedReport = false;

			event.dataValues.map(dataValue => {
				if(dataValue.dataElement === "OZUfNtngt0T") {//approval status
					if(dataValue.value === "Approved") {
						approvedReport = true;
						alert("Changes made will not be saved. You cannot change approved reports");
					}
				}
				return Promise.resolve();
			})

			
			if(!approvedReport) {
				event.dataValues.map(dataValue => {
					//if report is rejected and changes made, set to "re-submitted"
					if(dataValue.dataElement === "OZUfNtngt0T") {//approval status
						if(dataValue.value === "Rejected") {
							dataValue.value = "Re-submitted";
						}
					//if doctor forgot to enter working field, enter "working" by default
					} else if (dataValue.dataElement === "x2uDVEGfY4K") {//working status
						if(dataValue.value === "") {
							dataValue.value = "Working";
						}
					}
	
					if(dataValue.value !== "") {
						let state = this.props.getState();
						try {
							state.programs.map(program => {
								if(program.id === state.chosenProgram) {
									program.programStages.map(programStage => {
										if(programStage.programStage === state.chosenProgramStage) {
											programStage.dataElements.map(dataElement => {
												if(dataValue.dataElement === dataElement.dataElement.id) {
													if(dataElement.dataElement.valueType === "NUMBER") {
														dataValue.value = parseInt(dataValue.value);
													}
												}
											})
										}
									})
								}
							})
						} catch (error) {}

						let newDataValue = {
							value: dataValue.value,
							dataElement: dataValue.dataElement,
						}
						dataValues.push(newDataValue);
					}
					
					return Promise.resolve();
				})

				let eventShallBePUTed = false;


				if(event.hasOwnProperty("event")) {
					state.programs.map(program => {
						if(program.id === state.chosenProgram) {
							program.programStages.map(programStage => {
								if(programStage.programStage === state.chosenProgramStage) {
									programStage.events.map(prevEvent => {
										if(prevEvent.eventDate.slice(0,10) === event.eventDate.slice(0,10)) {
											//found previous event.
											eventShallBePUTed = true;
										}
									})
								}
							})
						}
					})
				}
	
				if(eventShallBePUTed) {
					//EVENT exists from before, and needs PUT
					let eventToPush = {
						event: event.event,
						program: state.chosenProgram,
						programStage: state.chosenProgramStage,
						status: "COMPLETED",
						trackedEntityInstance: state.trackedEntityInstance,
						dataValues: dataValues.reverse(),
						eventDate: event.eventDate,
					}

					this.props.updateProgramsEventFromChosenEvent(event);
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
							dataValues: dataValues.reverse(),
							status: "COMPLETED",
							eventDate: event.eventDate,
						}
					]}
	
					this.props.addToSubmitQue("/events", eventToPush, "POST");

					event.programStage = state.chosenProgramStage;
					event.status = "COMPLETED";

					this.props.updateProgramsEventFromChosenEvent(event)
				}
	
				this.setState({approvedStatus:false})
				this.clearChosenEvent();
			}
		} else {
			alert("No change has been made");
		}
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
		this.props.onEventChange(event);
		if(!this.state.changeMade) {
			this.setState({
				changeMade: true
			})
		}
	}

	enableForm() {
		return this.state.enableEdit;
	}

	setApprovalStatusToFalseIfTrue() {
		if(this.state.approvedStatus){
			this.setState({approvedStatus:false})
		}
	}

	checkAprovalStatusForApproved(event) { //if approved - do not edit any element.
		//console.log(this.state.approvedStatus);
		//if(!this.state.approvedStatus){
		if(event !== "") {
			if(event.hasOwnProperty("dataValues")) {
				event.dataValues.map(dataValue => {
					if(dataValue.dataElement === "OZUfNtngt0T") {
						//console.log(dataValue);
						if(dataValue.value === "Approved") {
							if(!this.state.approvedStatus){
								this.setState({approvedStatus:true})
							}
						} else {
							if(this.state.approvedStatus){
								this.setState({approvedStatus:false})
							}
						}
					}
					return Promise.resolve();
				})	
			}
		}

	}

	render() {
		let event = this.props.chosenEvent();
		//this.setApprovalStatusToFalseIfTrue();
		if(event.hasOwnProperty("dataValues")) {
			this.checkAprovalStatusForApproved(event);
			return <div className="displayEvents">
				{
				event.dataValues.map(dataValue => {
					let inputmode = "text";
					if(dataValue.valueType === "NUMBER") {
						inputmode = "numeric";
					}
					
					//report is approved and should not be changed
					if(this.state.approvedStatus) {
						if(dataValue.dataElement === "CCNnr8s3rgE") {  //reason for rejection
							if(dataValue.value === "") {
								//no value set, dont display element
							} else {
								return <FormElement.CreateElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
								inputmode={inputmode}
							/>
							}
						} else if(dataValue.optionSetValue) {
							return <FormElement.CreateOptionElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
								inputmode={inputmode}
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
					//Report is not approved, and should be changed
					} else {
						if(dataValue.dataElement === "OZUfNtngt0T") { //approval status - not to be changed
							if(dataValue.value === "") {
								//no value set, dont display element
							} else {
								return <FormElement.CreateOptionElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
							/>
							}
						} else if(dataValue.dataElement === "CCNnr8s3rgE") {  //reason for rejection
							if(dataValue.value === "") {
								//no value set, dont display element
							} else {
								return <FormElement.CreateElement 
								handleFieldChange={""} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={false}
								inputmode={inputmode}
							/>
							}
						} else if(dataValue.optionSetValue) {
							return <FormElement.CreateOptionElement 
								handleFieldChange={this.handleFieldChange} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={true}
								inputmode={inputmode}
							/>
						} else {
							return <FormElement.CreateElement 
								handleFieldChange={this.handleFieldChange} 
								dataValue={dataValue}
								key={dataValue.dataElement}
								enableEditForm={true}
								inputmode={inputmode}
							/>
						}
					}
				})
				}
				<button className="send-report-button" onClick={() => this.addToHandleSubmit()}>Send Report</button>
				<button className="send-report-button" onClick={() => this.clearChosenEvent()}>Back</button>
			</div>
		} else {
			return <p className="whiteText-1">Select event from calendar</p>
		}
	}
}

export default DisplayEvent;