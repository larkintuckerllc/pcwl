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
		when('/user_password', {
      	  		templateUrl: 'views/user_password.html',
       			controller: 'UserPasswordCtrl'
		}).
		when('/user_create', {
      	  		templateUrl: 'views/user_create.html',
       			controller: 'UserCreateCtrl'
		}).
		when('/logs', {
      	  		templateUrl: 'views/logs.html',
       			controller: 'LogsCtrl'
		}).
		when('/logs/:key/:from', {
      	  		templateUrl: 'views/log.html',
       			controller: 'LogCtrl'
		}).
		when('/columns', {
      	  		templateUrl: 'views/columns.html',
       			controller: 'ColumnsCtrl'
		}).
		when('/columns/:key', {
      	  		templateUrl: 'views/column.html',
       			controller: 'ColumnCtrl'
		}).
		when('/items/:key', {
      	  		templateUrl: 'views/item.html',
       			controller: 'ItemCtrl'
		}).
      		otherwise({
       			redirectTo: '/'
      		});
}]);
