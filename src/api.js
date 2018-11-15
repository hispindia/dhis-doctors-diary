/*
* This is where the api calls are
*/

const dhis2 = {
    baseUrl: `https://course.dhis2.org/dhis/api`,
    //baseUrl: `http://180.151.233.61/upupgrade/api`,
};

//gets programs from DHIS2
const getPrograms = (username, password) => {
    return fetch(`${dhis2.baseUrl}/programs?paging=false`, {
        method: 'GET',
        mode: 'cors',
        //credentials: 'include',
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        }
    })
        .catch(error => error)
        .then(response => response.json())
};

//function fills in users' trackedEntityInstance, enrollment and programStage
//but requires both orgUnit and program
const getUserInfo = (programId, username, password) => {
    return fetch(`${dhis2.baseUrl}/events?program=${programId}&fields=storedBy,program,href,event,programStage,
                enrollment,status,orgUnitName,dataValues,trackedEntityInstance,eventDate,dueDate&paging=false`, {
        method: 'GET',
        mode: 'cors',
        //credentials: 'include',
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        }
    })
    .catch(error => error)
    .then(response => response.json())
}

//Function fills up userData.dataElements with the programStage's associated dataElements 
const getProgramStageData = (programStageId, username, password) => {  
    return fetch(`${dhis2.baseUrl}/programStages/${programStageId}?fields=id,programStageDataElements[dataElement[optionSetValue,id,displayName,optionSet[id,displayName,options[name,id,sortOrder]]]&paging=false`,  {
        method: 'GET',
        mode: 'cors',
        //credentials: 'include',
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        }
    })
        .catch(error => error)
        .then(response => response.json())
};

//checks username/password - returns true or false, dependent on fetch result
const checkUserCredentials = (username, password) => {
    return fetch(`${dhis2.baseUrl}`,  {
        method: 'GET',
        mode: 'cors',
        //credentials: 'include',
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`, 
        }
    })
        .catch(error => error)
        .then(response => {
            if(response.status === 200) {
                return true;
            } else {
                return false;
            }  
        })
};

const getUsersOrgunit = (username, password) => {
    return fetch(`${dhis2.baseUrl}/me`, {
        method: 'GET',
        mode: 'cors',
        //credentials: 'include',
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        }
    })
        .catch(error => error)
        .then(response => response.json())
};

const postPayload = (endpoint, payload, method, username, password) => {
    return fetch(`${dhis2.baseUrl}${endpoint}`,  {
        method: method,
        mode: 'cors',
        //credentials: 'include',
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`, 
            "Content-type": "application/json",
        },
        body: payload,
    })
        .catch(error => error)
        .then(response => response.json())
};

export default {
    getPrograms,
    getUserInfo,
    getProgramStageData,
    checkUserCredentials,
    getUsersOrgunit,
    postPayload,
};

/*

POST to "https://course.dhis2.org/dhis/api/30/events.json"

{"events":[{
	"trackedEntityInstance":"vjVNrMa4zvc",
	"program":"r6qGL4AmFV4",
	"programStage":"ZJ9TrNgrtfb",
	"enrollment":"t9uszS9mfzD",
	"orgUnit":"eLLMnNjuluX",
	"notes":[],
	"dataValues":[
		{"value":1,"dataElement":"BIB2zYDYIJp"},
		{"value":1,"dataElement":"CXL5mg5l0cv"},
		{"value":1,"dataElement":"EZstOIjb7wN"},
		{"value":"1","dataElement":"romAEndBlt4"},
		{"value":"2","dataElement":"p5D5Y9x7yMc"},
		{"value":"3","dataElement":"LoY92GDoDC6"},
		{"value":"2","dataElement":"zrZADVnTtMa"}
		],
	"status":"ACTIVE",
	"eventDate":"2018-10-31"}
	]
}
*/