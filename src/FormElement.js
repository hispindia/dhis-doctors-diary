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

	render() {
		if(this.props.enableEditForm) {
			return(
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<form>
						<input
							inputMode={this.props.inputmode} 
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
		} else if(this.props.dataValue.dataElement === "CCNnr8s3rgE") {
			return(
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<form>
						<textarea
							disabled
							rows="5"
							className="item-select-disabled"
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
		this.props.handleFieldChange(this.props.dataValue.dataElement, event.target.value);
	}
	
	render() {
		if(this.props.enableEditForm) {
			return (
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<select className="item-select" id="right-align" value={this.state.value} onChange={this.handleChange}>
						{this.props.dataValue.optionSet.options.map(option => {
							return <option value={option.code} key={option.id}>{option.name}</option>
						})}
					</select>
				</div>
			);
		} else {
			return (
				<div className="formElement">
					<p className="formText">{this.props.dataValue.displayName}</p>
					<select disabled className="item-select" id="right-align-disabled" value={this.state.value}>
						{this.props.dataValue.optionSet.options.map(option => {
							return <option value={option.code} key={option.id}>{option.name}</option>
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