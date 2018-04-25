(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dhis2API", [], factory);
	else if(typeof exports === 'object')
		exports["dhis2API"] = factory();
	else
		root["dhis2API"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ajax.js":
/*!*****************!*\
  !*** ./ajax.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nfunction ajax(base_url) {\n\n    this.get = function (url, callback) {\n        url = base_url + url;\n\n        var request = new XMLHttpRequest();\n        request.open('GET', url, true);\n\n        request.onload = function () {\n            if (request.status >= 200 && request.status < 400) {\n                // Success!\n                var data = JSON.parse(request.responseText);\n                callback(null, request, data);\n            } else {\n                // We reached our target server, but it returned an error\n                callback(request, null, null);\n            }\n        };\n\n        request.onerror = function (e) {\n            // There was a connection error of some sort\n            callback(e, null, null);\n        };\n\n        request.send();\n    };\n\n    this.getReq = function (url, resolve) {\n\n        return new Promise((resolve, reject) => {\n            this.getReq(url, function (error, response, body) {\n                resolve(error, response, body);\n            });\n        });\n    };\n\n    this.post = function (url, obj, callback) {\n\n        url = base_url + url;\n\n        var request = new XMLHttpRequest();\n        request.open('POST', url, true);\n        request.setRequestHeader('Content-Type', 'application/json');\n\n        request.onload = function () {\n            if (request.status >= 200 && request.status < 400) {\n                // Success!\n                var data = JSON.parse(request.responseText);\n                callback(null, request, data);\n            } else {\n                // We reached our target server, but it returned an error\n                callback(request, null, null);\n            }\n        };\n\n        request.onerror = function (e) {\n            // There was a connection error of some sort\n            callback(e, null, null);\n        };\n\n        request.send(JSON.stringify(obj));\n    };\n\n    this.update = function (url, obj, callback) {\n        url = base_url + url;\n\n        var request = new XMLHttpRequest();\n        request.open('PUT', url, true);\n        request.setRequestHeader('Content-Type', 'application/json');\n\n        request.onload = function () {\n            if (request.status >= 200 && request.status < 400) {\n                // Success!\n                var data = JSON.parse(request.responseText);\n                callback(null, request, data);\n            } else {\n                // We reached our target server, but it returned an error\n                callback(request, null, null);\n            }\n        };\n\n        request.onerror = function (e) {\n            // There was a connection error of some sort\n            callback(e, null, null);\n        };\n\n        request.send(JSON.stringify(obj));\n    };\n\n    this.remove = function (url, callback) {\n        url = base_url + url;\n\n        var request = new XMLHttpRequest();\n        request.open('DELETE', url, true);\n        request.setRequestHeader('Content-Type', 'application/json');\n\n        request.onload = function () {\n            if (request.status >= 200 && request.status < 400) {\n                // Success!\n                var data = JSON.parse(request.responseText);\n                callback(null, request, data);\n            } else {\n                // We reached our target server, but it returned an error\n                callback(request, null, null);\n            }\n        };\n\n        request.onerror = function (e) {\n            // There was a connection error of some sort\n            callback(e, null, null);\n        };\n\n        request.send();\n    };\n}\n\nmodule.exports = ajax;\n\n//# sourceURL=webpack://dhis2API/./ajax.js?");

/***/ }),

/***/ "./dhis2API.js":
/*!*********************!*\
  !*** ./dhis2API.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var _ajax = __webpack_require__(/*! ./ajax.js */ \"./ajax.js\");\n\nfunction dhis2API() {\n\n    var ajax = new _ajax(\"../../\");\n\n    this.metadataService = function () {\n        this.getObj = function (param) {\n            return new Promise((resolve, reject) => {\n                ajax.get(param, function (error, response, body) {\n                    if (!error) {\n                        resolve(body);\n                    } else {\n                        reject(error);\n                    }\n                });\n            });\n        };\n    };\n    this.dataElementService = function () {\n\n        this.getDataElements = function (fields, filter) {\n            return new Promise((resolve, reject) => {\n                ajax.get(\"dataElements?fields=\" + fields, function (error, response, body) {\n                    if (!error) {\n                        resolve(body);\n                    } else {\n                        reject(error);\n                    }\n                });\n            });\n        };\n    };\n    this.userService = function () {\n\n        this.getCurrentUser = function (fields, filters) {\n            return new Promise((resolve, reject) => {\n                ajax.get(\"me?fields=\" + fields, function (error, response, body) {\n                    if (!error) {\n                        resolve(body);\n                    } else {\n                        reject(error);\n                    }\n                });\n            });\n        };\n    };\n\n    this.organisationUnitService = function () {\n\n        this.getOUGroups = function (fields, filters) {\n            return new Promise((resolve, reject) => {\n                ajax.get(\"organisationUnitGroups?paging=false&fields=\" + fields, function (error, response, body) {\n                    if (!error) {\n                        resolve(body);\n                    } else {\n                        reject(error);\n                    }\n                });\n            });\n        };\n    };\n\n    this.sqlViewService = function () {\n\n        this.getData = function (uid, callback) {\n            ajax.get(\"sqlViews/\" + uid + \"/data\", callback);\n        };\n\n        this.create = function (sqlViewObj, callback) {\n\n            ajax.post(\"sqlViews?\", JSON.stringify(sqlViewObj), callback);\n        };\n\n        this.remove = function (uid, callback) {\n            ajax.remove(\"sqlViews/\" + uid, callback);\n        };\n    };\n\n    this.periodService = function () {\n\n        this.getPeriods = function (periodType, startDate, endDate) {\n\n            switch (periodType) {\n                case \"Monthly\":\n                    debugger;\n                    return getMonthlyPeriods();\n                default:\n                    return getMonthlyPeriods();\n\n            }\n\n            function getMonthlyPeriods() {\n\n                var periods = [];\n                var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');\n                var MONTH_NAMES_SHORT = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');\n\n                var today = new Date();\n                var currentYear = today.getFullYear();\n                var currentMonth = today.getMonth();\n\n                for (var i = currentYear; i >= 1990; i--) {\n                    while (currentMonth != -1) {\n                        var monthStr = \"\";\n                        var cm = currentMonth + 1;\n                        if (cm < 10) {\n                            monthStr = \"0\";\n                        }\n                        periods.push({\n                            id: i + monthStr + cm,\n                            name: MONTH_NAMES_SHORT[currentMonth] + \" \" + i\n\n                        });\n\n                        currentMonth = currentMonth - 1;\n                    }\n                    currentMonth = 11;\n                }\n\n                return periods;\n            }\n        };\n    };\n\n    this.dataStoreService = function (dataStoreName) {\n\n        this.getAllKeyValues = function () {\n            return new Promise((resolve, reject) => {\n                ajax.get(\"dataStore/\" + dataStoreName, (error, response, body) => {\n\n                    if (error) {} else {\n                        var keyArray = [];\n\n                        body.forEach(key => {\n                            keyArray.push(this.getValue(key));\n                        });\n\n                        Promise.all(keyArray).then(function (values) {\n                            resolve(values);\n                        });\n                    }\n                });\n            });\n        };\n\n        function getKeys(callback) {\n\n            ajax.get(\"dataStore\", function (error, body, response) {\n                if (error) {} else {\n                    callback(response);\n                }\n            });\n        }\n\n        this.getValue = function (key, callback) {\n            if (callback) {\n                ajax.get(\"dataStore/\" + dataStoreName + \"/\" + key, callback);\n            } else {\n                return new Promise((resolve, reject) => {\n                    ajax.get(\"dataStore/\" + dataStoreName + \"/\" + key, function (error, response, body) {\n                        if (error) {\n                            resolve(error);\n                        } else {\n                            resolve(body);\n                        }\n                    });\n                });\n            }\n        };\n\n        this.remove = function (key, callback) {\n\n            ajax.remove(\"dataStore/\" + dataStoreName + \"/\" + key, callback);\n        };\n        this.saveOrUpdate = function (jsonObj, callback) {\n\n            ajax.update(\"dataStore/\" + dataStoreName + \"/\" + jsonObj.key, jsonObj, function (error, response, body) {\n                if (error || body.status == \"ERROR\") {\n                    // may be key not exist\n                    ajax.post(\"dataStore/\" + dataStoreName + \"/\" + jsonObj.key, jsonObj, function (error, response, body) {\n                        if (error) {\n                            console.log(\"Couldn't save data store key value\");\n                            callback(error, null, null);\n                            return;\n                        } else {\n                            callback(error, response, body);\n                        }\n                    });\n                } else {\n                    console.log(\"Updated Key\");\n                    callback(error, response, body);\n                }\n            });\n        };\n    };\n}\n\nmodule.exports = new dhis2API();\n\n//# sourceURL=webpack://dhis2API/./dhis2API.js?");

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./dhis2API.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! /home/harsh/Desktop/tomcat/dhis_home/apps/dhis2API/dhis2API.js */\"./dhis2API.js\");\n\n\n//# sourceURL=webpack://dhis2API/multi_./dhis2API.js?");

/***/ })

/******/ });
});