app.controller('HomeController', ['myService','$rootScope','sessionService', function(myService, $rootScope, sessionService){
	var vm = this;

	vm.listCourses = [];

	vm.init = function(){
		$rootScope.user = sessionService.get('user');
		if($rootScope.user == null){
			$rootScope.user = {};
			$rootScope.user.state = false;
		}

		myService.getListCourses().then(function(result){
			vm.listCourses = result;
		})
	}

	vm.show = function(str){
		var text = '';
		if(str.length > 100){
			text = str.substring(0, 100);
			text += '.....';
		}else{
			text = str;
		}

		return text;
	}

	vm.delete = function(id){
 		var r = confirm("Bạn muốn xóa khóa này này ?");
		if (r == true) {
		    myService.deleteCourse(id).then(function(result){
		    	if(result.status == 200){
					for (var i = 0; i < vm.listCourses.length; i++) {
						if(id == vm.listCourses[i].id){
							vm.listCourses.splice(i,1);break;
						}
					}
				}else{
					alert('Lỗi khi xóa');
				}
		    })
		} else {
		    
		}
 	}

 	
	vm.init();
}]);