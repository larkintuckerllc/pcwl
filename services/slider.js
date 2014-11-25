angular.module('myApp').directive('slider', ['$timeout', function($timeout) {
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
