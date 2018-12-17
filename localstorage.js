function localstorage(){

    this.save = function(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    }

    this.get = function (key){
        var val = localStorage.getItem(key);
        if (val != null){
            val = JSON.parse(val);
        }
        return val;
    }
    
}

module.exports = new localstorage();
