import React, { Component } from 'react';
import FormElement from "./FormElement";

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
						date: this.props.getState.date[0],
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

export default DisplayEvent;