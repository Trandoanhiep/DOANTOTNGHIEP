app.service('myService',['$http','$q', function($http,$q) {
    var service = {};
    var HOST = 'http://localhost:3000';

    service.getListCourses = function () {
    	var deferred = $q.defer();

    	var url = HOST + '/api/all-courses';
    	$http.get(url).then(function(response) {
	        deferred.resolve(response.data);
	    },
	    function(err) {
	    	deferred.reject(err);
	    });

    	return deferred.promise;
    }

    service.getCourse = function (id) {
    	var deferred = $q.defer();

    	var url = HOST + '/api/get-course';
    	var data = { id : id };

    	var config ={
	        method : "GET",
	        url : url,
	        params : data
	    }

    	$http(config).then(function(response) {
    		if(response.data.length > 0){
    			deferred.resolve({ status : 200, data : response.data[0]});
    		}else{
    			deferred.resolve({ status : 404 })
    		}
	    },
	    function(err) {
	    	deferred.reject(err);
	    });

    	return deferred.promise;
    }

    service.addCourse = function (course) {
    	var deferred = $q.defer();

    	var url = HOST + '/api/add-course';
    	var data = { course : course };

    	var config ={
	        method : "POST",
	        url : url,
	        params : data
	    }

    	$http(config).then(function(response) {
    		deferred.resolve(response);
	    },
	    function(err) {
	    	deferred.resolve(response)
	    });

    	return deferred.promise;
    }

    service.updateCourse = function (course) {
    	var deferred = $q.defer();

    	var url = HOST + '/api/update-course';
    	var data = { course : course };

    	var config ={
	        method : "POST",
	        url : url,
	        params : data
	    }

    	$http(config).then(function(response) {
            console.log(response)
    		deferred.resolve(response);

	    },
	    function(err) {
	    	deferred.resolve(response)
	    });

    	return deferred.promise;
    }

    service.deleteCourse = function (id) {
    	var deferred = $q.defer();

    	var url = HOST + '/api/delete-course';
    	var data = { id : id };

    	var config ={
	        method : "POST",
	        url : url,
	        params : data
	    }

    	$http(config).then(function(response) {
    		deferred.resolve(response);

	    },
	    function(err) {
	    	deferred.resolve(response)
	    });

    	return deferred.promise;
    }

    service.login = function (email, password) {
    	var deferred = $q.defer();

    	var url = HOST + '/api/login';
    	var data = { email : email , password : password , type : "1" };

    	var config ={
	        method : "GET",
	        url : url,
	        params : data
	    }

    	$http(config).then(function(response) {
    		if(response.data.length > 0){
    			deferred.resolve({ status : 200, data : response.data[0]});
    		}else{
    			deferred.resolve({ status : 404 })
    		}
	    },
	    function(err) {
	    	deferred.resolve(response)
	    });

    	return deferred.promise;
    }


    return service;
}]);