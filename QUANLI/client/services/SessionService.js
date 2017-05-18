app.service('sessionService',['$http','$q', function($http,$q) {
    var service = {};

    service.set = function (key,value) {
    	sessionStorage.setItem(key,JSON.stringify(value));
    }

    service.get = function (key) {
        var value = sessionStorage.getItem(key);

        return JSON.parse(value);
    }

    service.remove = function (key) {
        var value = sessionStorage.removeItem(key);
    }


    return service;
}]);