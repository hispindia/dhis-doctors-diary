import React,{propTypes} from 'react';

export function UploadFile(props){
        return (
                <div>
                    <label>Upload .xlsx/csv file</label>
                    <input type="file" id="fileInput"/>
                    <button onClick={props.onClick}>Import</button>
                </div>
            )
}
