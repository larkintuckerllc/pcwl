var module = angular.module('dataServices', []);

module.service('data', function() {
	var service = {
	};
	service.columns = [
		{'key': 'g1', 'description': 'Calorie Free', 'quality': 'good'},
		{'key': 'g2', 'description': 'Legumes', 'quality': 'good'},
		{'key': 'g3', 'description': 'Vegetables', 'quality': 'good'},
		{'key': 'g4', 'description': 'Fruits', 'quality': 'good'},
		{'key': 'g5', 'description': 'LF & Sugar Dairy', 'quality': 'good'},
		{'key': 'g6', 'description': 'Nuts', 'quality': 'good'},
		{'key': 'g7', 'description': 'Lean Meats', 'quality': 'good'},
		{'key': 's1', 'description': 'Whole Grain', 'quality': 'soso'},
		{'key': 'p1', 'description': 'Bread', 'quality': 'poor'},
		{'key': 'p2', 'description': 'Beverages', 'quality': 'poor'},
		{'key': 'p3', 'description': 'Condiments', 'quality': 'poor'},
		{'key': 'p4', 'description': 'Fried / Fat Foods', 'quality': 'poor'},
		{'key': 'p5', 'description': 'Desserts', 'quality': 'poor'}
	];
	service.kinds = [
                {'key': 'free_beverages', 'description': 'Calorie Free Beverages', 'column': 'g1'},
                {'key': 'free_condiments', 'description': 'Calorie Free Condiments', 'column': 'g1'},
                {'key': 'legumes', 'description': 'Legumes', 'column': 'g2'}
	];
        service.items = [
                {'key': 'coffee', 'description': 'Coffee', 'kind': 'free_beverages', 'quality': 'good', 'points': 0},
                {'key': 'crystal', 'description': 'Crystal Bay', 'kind': 'free_beverages', 'quality': 'good', 'points': 0},
                {'key': 'mustard', 'description': 'Mustard', 'kind': 'free_condiments', 'quality': 'good', 'points': 0},
                {'key': 'black_beans', 'description': 'Black Beans (1/2c)', 'kind': 'legumes', 'quality': 'good', 'points': 1}
        ];
	service.totals = [ 
		{key: 'points', name: 'Points'},
		{key: 'legumes', name: 'Legumes'},
		{key: 'vegetables', name: 'Vegetables'},
		{key: 'fruits', name: 'Fruits'},
		{key: 'dairy', name: 'LF & Sugar Dairy'},
		{key: 'nuts', name: 'Nuts'},
		{key: 'meats', name: 'Lean Meats'},
		{key: 'grain', name: 'Whole Grain'}
	];
	service.plans = {
		success: {
			points: {min: 37, max: 52},
			legumes: {min: 1, max: 2},
			vegetables: {min: 4},
			fruits: {min: 1, max: 2},
			dairy: {min: 2, max: 3},
			nuts: {min: 1, max: 2},
			meats: {min: 2, max: 2},    				
			grain: {min: 1, max: 1}
		},
		champion: {
			points: {min: 47, max: 62},
			legumes: {min: 2, max: 3},
			vegetables: {min: 5},
			fruits: {min: 2, max: 3},
			dairy: {min: 3, max: 4},
			nuts: {min: 1, max: 2},
			meats: {min: 2, max: 2},    				
			grain: {min: 1, max: 1}
		}, 
		achieve: {
			points: {min: 62, max: 75},
			legumes: {min: 3, max: 3},
			vegetables: {min: 6},
			fruits: {min: 3, max: 3},
			dairy: {min: 4, max: 4},
			nuts: {min: 2, max: 3},
			meats: {min: 2, max: 3},    				
			grain: {min: 1, max: 1}
		}
	};
	service.inRange = function(value, min, max) {
		var inRg = false;
		if (max) {
			if (value >= min && value <= max) {
				inRg= true;
			}
		} else {
			if (value >= min) {
				inRg = true;
			}
		}
		return inRg;
	};
	return service;
});
