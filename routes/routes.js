angular.module('myApp').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
      	  		templateUrl: 'views/update.html',
       			controller: 'UpdateCtrl'
      		}).
		when('/home', {
      	  		templateUrl: 'views/home.html',
       			controller: 'HomeCtrl'
      		}).
		when('/login', {
      	  		templateUrl: 'views/login.html',
       			controller: 'LoginCtrl'
      		}).
		when('/error', {
      	  		templateUrl: 'views/error.html',
       			controller: 'ErrorCtrl'
      		}).
		when('/about', {
      	  		templateUrl: 'views/about.html',
       			controller: 'AboutCtrl'
		}).
		when('/user', {
      	  		templateUrl: 'views/user.html',
       			controller: 'UserCtrl'
		}).
		when('/user_create', {
      	  		templateUrl: 'views/user_create.html',
       			controller: 'UserCreateCtrl'
		}).
      		otherwise({
       			redirectTo: '/'
      		});
}]);
