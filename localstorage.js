function localstorage(){

    this.save = function(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    }

    this.get = function (key){
        return JSON.parse(localStorage.getItem(key));
    }
    
}

module.exports = new localstorage();
