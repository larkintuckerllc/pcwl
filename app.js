var myApp = angular.module('myApp', [
	'ngRoute',
	'blockUI',
	'navigatorServices',
	'dataServices',
	'standardControllers',
	'homeControllers'
])
.config(function(blockUIConfigProvider) {
	blockUIConfigProvider.autoBlock(false);
});
