/**
 * Created by harsh on 7/5/16.
 */

var _ = {};

_.prepareIdToObjectMap = function(object,id){
    var map = [];
    for (var i=0;i<object.length;i++){
        map[object[i][id]] = object[i];
    }
    return map;
}

_.prepareKeyMap = function(object,id,value){
    var map = [];
    for (var i=0;i<object.length;i++){
        map[object[i][id]] = value;
    }
    return map;
}

_.prepareMapGroupedById= function(object,id){
    var map = [];
    for (var i=0;i<object.length;i++){
        if (!map[object[i][id]]){
            map[object[i][id]] = [];
        }
        map[object[i][id]].push(object[i]);
    }
    return map;
}

_.prepareUID = function(options,ids){
    
    var sha1 = require('js-sha1');
    var sortedIds = ids.sort();
    var uid = sha1(sortedIds.join(";"));

    //   console.log("uid="+uid+","+ids.toString());
    return "C"+uid.substr(0,10);
}
/*
  _.flattenMap = function(data,delimiter){

  var flattenedData = {};
  for (var key in data){
  if (typeof data[key] == "object"){
  for (var key2 in data[key]){
  flattenedData[key+delimiter+key2] = data[key][key2]; 
  }
  }else{
  flattenedData[key] = data[key]; 
  }
  }
  return flattenedData;
  }
*/
_.flattenMap = function(data,delimiter,includeUndefined){

    var flattenedData = {};
    for (var key in data){
        var resultingKey = "";
        inner(key,data[key],resultingKey,delimiter,flattenedData)
    }

    return flattenedData;

    function inner(key,data,resultingKey,delimiter,flattenedData){
        resultingKey += key;

        if (typeof data == "object"){
            var isEmpty = true;
            for (var key in data){
                isEmpty = false;
                inner(key,data[key],resultingKey+delimiter,delimiter,flattenedData)
            }
            if (isEmpty && includeUndefined){                
                flattenedData[resultingKey] = undefined;                
            }
        }else{
            flattenedData[resultingKey] = data;
        }
    }
}
_.getMapLength = function(map){
    var index =0;
    for (var key in map){
        index = index+1;
    }
    
    return index;
}

//http://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
//http://stackoverflow.com/users/3119662/kubosho
_.isJson = function(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

_.shadowStringify= function (json){
    var str = json;
    str = JSON.stringify(str);
    str = str.replace(/\"/g,'^');
    str = str.replace(/{/g,'<');
    str = str.replace(/}/g,'>');
    return str;
}

_.unshadowStringify = function(str){
    str = str.replace(/\^/g,'"');
    str = str.replace(/</g,'{');
    str = str.replace(/>/g,'}');

    return JSON.parse(str);
}

_.findValueAgainstId = function (data,idKey,id,valKey){

    for (var i=0;i<data.length;i++){
        if (data[i][idKey]==id){
            return data[i][valKey]
        }
    }
    return null;
}

_.putValueAgainstId = function (data,idKey,id,valKey,value){

    for (var i=0;i<data.length;i++){
        if (data[i][idKey]==id){
            data[i][valKey] = value
            return true
        }
    }
    return null;
}


_.findObjectAgainstId = function (data,idKey,id){

    for (var i=0;i<data.length;i++){
        if (data[i][idKey]==id){
            return data[i]
        }
    }
    return null;
}


_.checkListForValue = function (data,idKey,id,valKey,values){
    for (var i=0;i<data.length;i++){
        if (data[i][idKey]==id){
            for (var key in values){
                if (data[i][valKey] == values[key]){
                    return true
                }
            }
        }
    }
    return false;
}

_.reduce = function(list,id,seperator){
    var accumlator = "";
    for (var key in list){
        accumlator = accumlator + list[key][id] + seperator;
    }
    return accumlator;
}

_.reduceMapByKey = function(map,seperator){
    var accumlator = "";
    for (var key in map){
        accumlator = accumlator + key + seperator;
    }
    return accumlator;
}

_.getMaxMinFromList = function(list,id){

    var result = {max : null,min:null};

    for (var key in list){
        if (!result.max){result.max = list[key][id]}
        if (!result.min){result.min = list[key][id]}

        if (result.max < list[key][id]){result.max = list[key][id]}
        if (result.min > list[key][id]){result.min = list[key][id]}

    }
    return result;    
}

_.makeFacilityStrBelowLevel = function(ou,level){

    return ou.ancestors.reduce(function(str,obj){
        if(obj.level>level){
            str = str + obj.name + " / " ;
        }
        return str;
    },"")  + ou.name;
    

}
module.exports = _;
