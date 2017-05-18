app.controller('CreateController', ['$rootScope', '$state', 'myService', 'sessionService', '$stateParams', 'Upload',
function($rootScope,$state, myService, sessionService, $stateParams, Upload){
	var vm = this;

	vm.courseId = $stateParams.id;

	vm.course = {
		id : '',
		name : '',
		subject : 0,
		word : 0,
	};
	vm.title = '';
	vm.buttonName = '';

	vm.Imgfile;
	vm.Zipfile;

	vm.init = function(){
		if(vm.courseId == ''){
			vm.title = 'THÊM KHÓA HỌC';
			vm.buttonName = 'THÊM MỚI';
		}else{
			vm.title = 'CẬP NHẬT KHÓA HỌC';
			vm.buttonName = 'CẬP NHẬT';

			myService.getCourse(vm.courseId).then(function(result){
				if(result.status == 200){
					vm.course = result.data;
				}else{
					console.log('Không tìm thấy')
				}
			});
		}
	}


	var addCourse = function(course){
		myService.addCourse(course).then(function(result){
				if(result.status == 200){
					alert('Thêm mới thành công');

					upload(vm.Imgfile, course.id); 
					upload(vm.Zipfile, course.id); 

					vm.course = {
						id : '',
						name : '',
						subject : 0,
						word : 0,
					};

			        

				}else{
					alert('Lỗi khi thêm mới');
				}
			});
	}

	var upload = function(file, idCourse){
		console.log(file)
        Upload.upload({
            url : 'http://localhost:3000/api/upload', 
            data : { file : file },
            params :  {id : idCourse, type : 'course' }
        }).then(function (resp) { 
            if(resp.data.error_code === 0){ 
            	
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
	}


	var updateCourse = function(course){
		myService.updateCourse(course).then(function(result){
				if(result.status == 200){
					alert('cập nhật thành công thành công');
					if(vm.Imgfile != null){
						upload(vm.Imgfile, course.id); 
					}
				}else{
					alert('Lỗi cập nhật');
				}
			});
	}

	vm.createOrEdit = function(){
		if(vm.course.id == '' || vm.course.name == '' || vm.course.subject == '' || vm.course.word == ''){
			alert('Bạn  cần nhập đầy đủ thông tin');
		}else{
			if(vm.courseId == ''){
				var nameZipFile = vm.Zipfile.name.split('.')[0];
				if(vm.course.id != nameZipFile){
					alert('Mã khóa học cần phải trùng với tên của zip file');
				}else{
					addCourse(vm.course);
				}
				
			}else{
				updateCourse(vm.course);
			}
				
				
		}
			
	}
 

	vm.init();
}]);