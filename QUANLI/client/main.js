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
