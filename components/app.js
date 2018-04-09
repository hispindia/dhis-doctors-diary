import React,{propTypes} from 'react';
import dhis2API from '../dhis2API'

export function UploadFile(props){

    function encodeFileAsURL(){}
    return (
            <div>
            <input type="file" id={props.id} onChange={encodeFileAsURL(this)}/>
            </div>
    )
}

export function ReportContainer(props){


    return (

            <NewReportForm />            

    )

}

function NewReportForm(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;   


      function addRow(){

        var data = {
            name : "Report1",
            period : "Montlhy",
            ou : "sadfasf",
            excelTemplate : {},
            xml : {}
        }
        
        
        var dsService = new dhis2API.dataStoreService("XLReports");

        dsService.saveOrUpdate(data,function(error,response,body){
            
        });
      }

    function handleSubmit(event){
        event.preventDefault();

        var data = {
            name : event.target.elements.name.value,
            description : event.target.elements.description.value,
            periodType : event.target.elements.periodType.selectedOptions[0].value,
            orgUnitLevel : event.target.elements.orgUnitLevel.value,
            excelTemplate : JSON.stringify(event.target.elements.excelFile.files[0]),
            xml : JSON.stringify(event.target.elements.xmlFile.files[0])
        }
        
           debugger
        var dsService = new dhis2API.dataStoreService("XLReports");

        dsService.saveOrUpdate(data,function(error,response,body){
            debugger
        });
        
        
    }
 
    instance.render = function(){
        return (
     
            <form onSubmit={handleSubmit}>
            <table>
            <tbody>
            <tr>
            <td>Name : </td><td><input id="name" type="text"></input></td>
            </tr>
            <tr>
            <td>Description : </td><td><input id="description" type="text"></input></td>
            </tr>
            <tr>
            <td>Period Type : </td><td><select id="periodType">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option></select></td>
            </tr>
            <tr>
            <td>Org Unit Level : </td><td><input type="number" id="orgUnitLevel"></input></td>
            </tr>
            <tr>
            <td>Upload Excel Template </td><td><UploadFile id="excelFile"/></td>
            </tr>
            <tr>
            <td>Upload XML Mapping File : </td><td><UploadFile id="xmlFile" /></td>
            </tr>
            
            </tbody>
            </table>

            <input type="submit"  value="Add"></input>
                </form>
        )
    }

    return instance;
}

function AddNewButton(){


    function addRow(){

        var data = {
            name : "Report1",
            period : "Montlhy",
            ou : "sadfasf",
            excelTemplate : {},
            xml : {}
        }
        
        
        var dsService = new dhis2API.dataStoreService("XLReports");

        dsService.saveOrUpdate(data,function(error,response,body){
            
        });
        
        

    }
    
    return (
            <input type="button" onClick = {addRow} value="Add"></input>
    )

}
