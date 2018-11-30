/*
* This is where the api calls are
*/

const dhis2 = {
    //baseUrl: `https://course.dhis2.org/dhis/api`,
    //baseUrl: `http://180.151.233.61/upupgrade/api`,
    baseUrl: `https://uphmis.in/uphmis/api`,
};

//gets programs from DHIS2
const getPrograms = (username, password, programID) => {
    return fetch(`${dhis2.baseUrl}/programs?paging=false&filter=id:eq:${programID}`, {
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

//function gets enrollment and trackedEntityData
const getEnrollmentAndTrackedED = (orgUnit, programId, username, password) => {
    return fetch(`${dhis2.baseUrl}/trackedEntityInstances?ou=${orgUnit}&program=${programId}&fields=*&filter:attributes.value:eq:${username}`, {
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

//function fills in users' programStages
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
    return fetch(`${dhis2.baseUrl}/programStages/${programStageId}?fields=id,name,displayName,programStageDataElements[dataElement[valueType,optionSetValue,sortOrder,id,displayName,optionSet[id,displayName,options[name,id,sortOrder,code]]]&paging=false`,  {
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
    return fetch(`${dhis2.baseUrl}/me?fields=id,userGroups[code,id],userCredentials[userRoles],organisationUnits`, {
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
    getEnrollmentAndTrackedED,
    getUserInfo,
    getProgramStageData,
    checkUserCredentials,
    getUsersOrgunit,
    postPayload,
};