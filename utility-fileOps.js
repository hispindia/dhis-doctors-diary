function utilityFileOps(){
  
    this.loadExcelFile = function(file){
        
        return new Promise((resolve,reject) =>{
            var XLSX = require('xlsx-populate');            
            var reader = new FileReader();
            
            reader.onload = function ( evt ) { 
                var data = evt.target.result;
                try{
                    var wb = XLSX.fromDataAsync(file).then(function(wb){

                        wb.outputAsync("base64").then(function(base64){
                            resolve(base64)
                        })
                        
                    });

                }catch(e){
                    reject(e)
                }
            }
            reader.readAsBinaryString(file);
        })
    }

    this.loadJsonFile = function(file){
        return new Promise((resolve,reject) => {
            var reader = new FileReader();
            
            reader.onload = function ( evt ) { 
                try{
                    resolve(evt.target.result);
                }catch(e){reject(e)}
            }
            reader.readAsText(file);
        })        
    }
    
}

module.exports = new utilityFileOps();
