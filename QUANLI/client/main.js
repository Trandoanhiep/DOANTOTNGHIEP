// angular.module('fileUpload', ['ngFileUpload'])
// .controller('MyCtrl',['Upload','$http',function(Upload,$http){
//     var vm = this;
//     vm.submit = function(){ //function to call on form submit
//         if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
//             vm.upload(vm.file); //call upload function
//         }
//     }

//     vm.get = function(){
//         $http.get("http://localhost:3000/add-course")
//         .then(function(response) {
//             console.log(response.data);
//         });
//     }
    
//     vm.upload = function (file) {
//         console.log(file)
//         Upload.upload({
//             url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
//             data:{file:file} //pass file as data, should be user ng-model
//         }).then(function (resp) { //upload function returns a promise
//             if(resp.data.error_code === 0){ //validate success
//                 alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
//             } else {
//                 alert('an error occured');
//             }
//         }, function (resp) { //catch error
//             console.log('Error status: ' + resp.status);
//             alert('Error status: ' + resp.status);
//         }, function (evt) { 
//             console.log(evt);
//             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
//             vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
//         });
//     };
// }]);


var app = angular.module('myApp', ['ui.router','ngFileUpload']);

app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', 
function($urlRouterProvider, $stateProvider, $locationProvider){
    $urlRouterProvider.otherwise('/home');

    $stateProvider     
    .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        authenticate: false
    })
    .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        authenticate: false
    })
    .state('create-edit', {
        url: '/create-edit/:id',
        templateUrl: 'views/add-course.html',
        authenticate: false
    })
    .state('create-toeic', {
        url: '/create-toeic/',
        templateUrl: 'views/add-toeic.html',
        authenticate: false
    })

}])
// .run(['$rootScope','sessionService','$state',function($rootScope, sessionService, $state){
//     $rootScope.user = sessionService.get('user');
//     if($rootScope.user == null){
//         $rootScope.user = {};
//         $rootScope.user.state = false;
//         $rootScope.user.username = ''s;
//     }

//     if($rootScope.user.state == false){
//         $state.go('login');
//     }else{
//          $state.go('home');
//     }
// }]);
