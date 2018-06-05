import React,{propTypes} from 'react';

export function MetadataFormComponent(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    var state = {metadata : props.metadata}

      function textInputChangedMetadata(name,e) {
        state.metadata[name] = e.target.value
        instance.setState(state)
    }

      function onPeriodTypeChange(e){
        state.metadata.periodType = e.target.selectedOptions[0].value;
        instance.setState(state);
    }

    function onReportTypeChange(e){
        state.metadata.reportType = e.target.selectedOptions[0].value;
        instance.setState(state);
    }

    function excelUploaded(e){
        state.metadata.excel = {
            name : e.target.files[0].name,
            size : e.target.files[0].size,
            file : e.target.files[0]
        }
    }
    
    function goToReportList(){
        window.location.href = "./index.html#/reports";        
    }
  
    instance.render = function(){
        return (
            <div>
                <table >
                <tbody>
                <tr>
                <td> Key: <input disabled id="key" value={state.metadata.key}  type="text"></input></td></tr>
                <tr>
                <td>Name : </td><td><input id="name" value={state.metadata.name} onChange={textInputChangedMetadata.bind(null,'name')} type="text"></input></td>
                </tr>
                <tr>
                <td>Description : </td><td><input id="description" onChange={textInputChangedMetadata.bind(null,'description')} type="text" value={state.metadata.description} ></input></td>
                </tr>
                <tr>
                <td>Period Type : </td><td><select id="periodType" value={state.metadata.periodType} onChange={onPeriodTypeChange}>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>

                </select></td>
                </tr>
                <tr><td>Report Type: <select id="reportType" value={state.metadata.reportType} onChange={onReportTypeChange}>
                <option value="OUWiseProgressive">OUWiseProgressive</option>
                <option value="PeriodWiseProgressive">PeriodWiseProgressive</option></select></td></tr>

                <tr>
                <td>Org Unit Level : </td><td><input type="text" id="orgUnitLevel" value={state.metadata.orgUnitLevel} onChange={textInputChangedMetadata.bind(null,'orgUnitLevel')} ></input></td>
                </tr>
                <tr>
                <td>Upload Excel Template </td><td><input type="file"
                                                          id="excelFile"
                                                          onChange={excelUploaded} /></td>
                </tr>
                <tr>
                <td>Upload Mapping File : </td><td><input type="file" id="jsonFile" /></td>
                </tr>
                
            </tbody>
                </table>
                </div>

        )        
    }

    return instance;
}
