import React, { Component } from 'react';
import "./styles.css";

class CreateTextElement extends Component {

	changeHandeler(event) {
    	this.props.handleFieldChange(this.props.dataValue.dataElement, event.target.value);
  	}  

	render() {
    	return(
		<article className="formElement">
			<p className="whiteText">{this.props.dataValue.displayName}</p>
			<form>
				<label>
				<input
					onChange={this.changeHandeler.bind(this)}
					className="inputField"
					id={this.props.dataValue.dataElement}
					key={this.props.dataValue.dataElement}
					type="text" 
					defaultValue={this.props.dataValue.value} />
				</label>
			</form>
		</article>
    	)
  	}
}

class CreateOptionElement extends Component {
    changeHandeler(event) {
		let value = event.target.value;
		this.props.dataValue.optionSet.options.map(option => {
			if(option.id === value) {
				value = option.sortOrder;
			}
		})
		console.log(value);
		console.log(this.props.dataValue.dataElement);
      	this.props.handleFieldChange(this.props.dataValue.dataElement, value);
    }

	render() {
    	return(
			<div className="formElement">
				<p className="whiteText">{this.props.dataValue.optionSet.displayName}</p>
				<select className="textField"
				onChange={this.changeHandeler.bind(this)}
					id={this.props.dataValue.dataElement}>
					{this.props.dataValue.optionSet.options.map(option => {
						if(option.sortOrder === this.props.dataValue.value) {
							return <option key={option.id} value={option.id} selected="selected">{option.name}</option> 
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


export default {
  CreateTextElement,
  CreateOptionElement,
}