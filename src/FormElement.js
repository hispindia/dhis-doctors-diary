import React, { Component } from 'react';
import "./formElement.css";

class CreateElement extends Component {

	changeHandeler(event) {
		let type = this.props.dataValue.valueType;
		let value = event.target.value;
		if(type === "TEXT") {
			//0-255 characters
			if(value.length > 255) {
				value = value.slice(0, 255);
				event.target.value = value;
			}
		} else if (type === "LONG_TEXT") {
			//0-65000 characters
			if(value.length > 65000) {
				value = value.slice(0, 65000);
				event.target.value = value;
			}
		} else if (type === "NUMBER" || type === "INTEGER_ZERO_OR_POSITIVE") {
			//0-9
			value = value.replace(/[^0-9]/i, '');
			event.target.value = value;
		}

		this.props.handleFieldChange(this.props.dataValue.dataElement, value);
	}

	checkType() {
	}
	  

	render() {
		if(this.props.enableEditForm) {
			return(
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<form>
						<input
							className="item-select"
							onChange={this.changeHandeler.bind(this)} //remove this for disable
							id="right-align"
							key={this.props.dataValue.dataElement}
							type="text"
							defaultValue={this.props.dataValue.value} //set this to "value" to disable edit 
							/> 
					</form>
				</div>
			)
		} else {
			return(
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<form>
						<input
							disabled
							className="item-select"
							onChange={this.changeHandeler.bind(this)} //remove this for disable
							id="right-align-disabled"
							key={this.props.dataValue.dataElement}
							type="text"
							defaultValue={this.props.dataValue.value} //set this to "value" to disable edit 
							/> 
					</form>
				</div>
				)
		}
  	}
}

class CreateOptionElement extends Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
	
		this.handleChange = this.handleChange.bind(this);
	  }

	componentWillMount() {
		this.setState({value:this.props.dataValue.value})
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
		this.props.handleFieldChange(this.props.dataValue.dataElement, this.state.value);
	}
	
	render() {
		if(this.props.enableEditForm) {
			return (
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<select className="item-select" id="right-align" value={this.state.value} onChange={this.handleChange}>
						{this.props.dataValue.optionSet.options.map(option => {
							return <option value={option.sortOrder} key={option.id}>{option.name}</option>
						})}
					</select>
				</div>
			);
		} else {
			return (
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<select disabled className="item-select" id="right-align-disabled" value={this.state.value} onChange={this.handleChange}>
						{this.props.dataValue.optionSet.options.map(option => {
							return <option value={option.sortOrder} key={option.id}>{option.name}</option>
						})}
					</select>
				</div>
			);
		}
	}
}

export default {
	CreateElement,
  	CreateOptionElement,
}
 
	
/*	changeHandeler(event) {
		console.log(event);
		console.log(event.target);
		console.log(event.target.value);
		let value = event.target.value;
		this.props.dataValue.optionSet.options.map(option => {
			if(option.id === value) {
				value = option.sortOrder;
			}
			return Promise.resolve();
		})
		console.log(value);
		this.props.handleFieldChange(this.props.dataValue.dataElement, value);
    }

	render() {
    	return(
			<div className="formElement">
				<p className="formText">{this.props.dataValue.optionSet.displayName}</p>
				<select className="item-select"
				//disabled
				onChange={this.changeHandeler.bind(this)}
					id="right-align">
					<option value="" selected disabled hidden>Select option</option>
					{this.props.dataValue.optionSet.options.map(option => {
						let value = this.props.dataValue.value;
						let sortOrder = JSON.stringify(option.sortOrder);
						if(value === sortOrder) {
							console.log("Value found");
							console.log(value);
							console.log(option);
							return <option selected key={option.id} value={option.id}>{option.name}</option> 
						} else {
							return <option key={option.id} value={option.id}>{option.name}</option> 
						}
					})
				}
				</select>
			</div>
      	)
    }
} 
*/