var module = angular.module('controlDirectives', []);

module.directive('slider', ['$timeout', function($timeout) {
    var directive = {};
    directive.restrict = 'A';
    directive.scope = {
        value: "=value"
    };
    directive.compile = function(element, attributes) {
        element.addClass('slider');
        element.html('<div class="track"><div class="leftsection"></div><div class="rightsection"></div><div class="thumb"></div></div>');
        var link = function($scope, element, attributes) {
            var touchStart;
            var touchStartX;
            var leftsection = element.find('.leftsection');
            var rightsection = element.find('.rightsection');
            var thumb = element.find('.thumb');
            function positionSlider() {
                var position = parseInt(100 / (attributes.positions - 1) * $scope.value);
                leftsection.css('width', position + '%');
                rightsection.css('width', (100 - position) + '%');
                thumb.css('left', (position - 5) + '%');    
            }
            positionSlider();
            leftsection.on('click', function(event) {

		// SPECIAL CASE FOR THIS SLIDER
		if ($scope.value != 1) {
                	$timeout(function() {
                    		$scope.value -= 1;
                    		positionSlider();
                	});
		}
            });
            rightsection.on('click', function(event) {
                $timeout(function() {
                    $scope.value += 1;
                    positionSlider();
                });
            });
            thumb.on('touchstart', function(event) {
                touchStart = true;
                touchStartX = parseInt(event.originalEvent.changedTouches[0].clientX);
            });
            thumb.on('touchmove', function(event) {
                if (touchStart) {
                    touchStart = false;
                    var distanceX = parseInt(event.originalEvent.changedTouches[0].clientX) - touchStartX;
                    if (distanceX > 0 && $scope.value < (attributes.positions - 1)) {   
                        $timeout(function() {
                            $scope.value += 1;
                            positionSlider();
                        });
                    }
                    if (distanceX < 0 && $scope.value > 0) { 

			// SPECIAL CASE FOR THIS SLIDER
			if ($scope.value != 1) {
				$timeout(function() {
				    $scope.value -= 1;
				    positionSlider();
				});
			}
                    }
                }
            });
        };
        return link;
    };
    return directive;
}]);

module.directive('lineChart', ['$window', function($window) {
	var directive = {
		restrict: 'A',
		scope: {
			data: '=chartData',
			min: '=chartMin',
			max: '=chartMax'
		},
		link: function (scope, element, attrs) {
			var chartDiv = $window.d3.select(element[0]);
			var chart = c3.generate({
				bindto: chartDiv,
				size: {
					width: 280,
					height: 200
				},
				interaction: {
					enabled: false
				},
				axis: {
					x: {
						show: false
					},
					y: {
						min: 0, 
						max: 1
					}
				},
				legend: {
					show: false
				},
				data: {
					x: 'x',
					columns: [
						['x', 0, 1],
						['data1', 0, 0]
					],
					types: {
						data1: 'area'
					}
				}
			});
			scope.$watch(function() { 
				return scope.data
			}, function() { 
				var columns = [
					['x'],
					['data1']
				];
				columns[0] = columns[0].concat(scope.data[0]);
				columns[1] = columns[1].concat(scope.data[1]);
				chart.load({
					columns: columns
				});
				chart.axis.min(scope.min);
				chart.axis.max(scope.max);
			}, true);
		}
	};
	return directive;
}]);    
