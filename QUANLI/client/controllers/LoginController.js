app.controller('LoginController', ['$rootScope','$state', 'myService','sessionService', function($rootScope,$state, myService,sessionService){
	var vm = this;

	vm.email = '';
	vm.password = '';
	vm.init = function(){
		// $('#myModal').modal('show');
	}

	vm.login = function(){
		myService.login(vm.email, vm.password).then(function(result){
			if(result.status == 200){
				var user = {
					state : true,
					username: result.data.fullname
				}
				sessionService.set('user', user);

				$('#myModal').modal('hide');
				$state.go('home');
			}else{

			}
		})
	}

	$rootScope.logout = function(){
		var r = confirm("Bạn muốn đăng xuất ?");
		if (r == true) {
			$('#myModal').modal('show', {backdrop: 'static', keyboard: false});
			sessionService.remove('user');

			$state.go('login');
		} else {
		    
		}
	}

	vm.init();
}]);