app.controller('CreateToecicController', ['$rootScope', '$state', 'myService', 'sessionService', '$stateParams', 'Upload',
function($rootScope,$state, myService, sessionService, $stateParams, Upload){
	var vm = this;


	vm.Zipfile;

	vm.select = function(part){
	    vm.selectPart = part;   
	}

	vm.upload = function(){
		var file = vm.Zipfile;
		var nameFile = vm.Zipfile.name.split('.')[0];
		if(file){
			Upload.upload({
	            url : 'http://localhost:3000/api/upload', 
	            data : { file : file },
	            params :  { id : nameFile, type : 'toeic', }
	        }).then(function (resp) { 
	            if(resp.data.error_code === 0){ 
	            	alert('Thêm đề toeic thành công');
	            } else {
	                alert('Lỗi upload');
	            }
	        }, function (resp) { //catch error
	            console.log('Error status: ' + resp.status);
	            alert('Error status: ' + resp.status);
	        }, function (evt) { 
	            console.log(evt);
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
	        });
		}else{
			alert("Vui lòng chọn tệp dữ liệu");
		}
	        
	}

}]);