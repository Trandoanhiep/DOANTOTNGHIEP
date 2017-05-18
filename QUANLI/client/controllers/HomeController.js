app.controller('HomeController', ['myService','$rootScope','sessionService', function(myService, $rootScope, sessionService){
	var vm = this;

	vm.listCourses = [];
	vm.totalPages = [];
	var limit = 2;
	vm.currentPage = 1;
	var listCourses = [];



	vm.init = function(){
		$rootScope.user = sessionService.get('user');
		if($rootScope.user == null){
			$rootScope.user = {};
			$rootScope.user.state = false;
		}

		myService.getListCourses().then(function(result){
			listCourses = result;

			var totalPage = Math.ceil(listCourses.length/limit);
			for (var i = 0; i < totalPage; i++) {
				vm.totalPages.push(i+1);
			}

			paginate(vm.currentPage);
		})
	}

	var paginate = function(currentPage){
		vm.listCourses = [];
		for (var i = (currentPage-1)*limit ; i < currentPage*limit ; i++) {
			if(i < listCourses.length) vm.listCourses.push(listCourses[i])
		}

	}

	vm.next = function(){
		if(vm.currentPage < vm.totalPages.length){
			vm.currentPage++;
		}

		paginate(vm.currentPage);
	}

	vm.prev = function(){
		if(vm.currentPage > 1){
			vm.currentPage--;
		}

		paginate(vm.currentPage);
	}

	vm.goToPage = function(page){
		vm.currentPage = page;

		paginate(vm.currentPage);
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