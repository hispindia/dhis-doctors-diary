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

    
    this.reset = function(){
          
        for (var key in localStorage){
            if (key.startsWith("dd_")){
                localStorage.removeItem(key);

                console.log(key)
            }
        }
    }
}

module.exports = new localstorage();
