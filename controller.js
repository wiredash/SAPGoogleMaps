angular.module('mapMe').controller('MapMeController', ['$scope', 'locations', 'filters', 'currentLocation' , function($scope, locations, filters, currentLocation) {
  _.extend($scope, {
    locations: locations,
    filters: filters,
    currentLocation: currentLocation,
    selectedLocations: function() {
      return _($scope.locations).filter({selected: true}).value()
    },
    // TODO move next 2 functions to exclusive filter directive when implemented
    allSelected: function(filter) {
      return filter.selected.length == filter.values.length;
    },
    toggleSelectAll: function(filter) {
      var newValue = !$scope.allSelected(filter);
      if (newValue) {
        filter.selected = _.clone(filter.values);
      } else {
        filter.selected = [];
      }
    },
    clearAllFilters: function() {
      _($scope.filters).each(function(filter) {
        filter.selected = _.clone(filter.values)
      })
    }
  });

  _($scope.filters).each(function(filter) {
    if (filter.selected == undefined) {
      filter.selected = _.clone(filter.values);
    }
  });
  $scope.selectedFilter = $scope.filters[0];

  // Watch for filter changes and populate $scope.filtered
  $scope.$watchCollection(
    function() {
      return _($scope.filters).map('selected').join();
    },
    function() {
      var filterFunction = function(filter) {
        return function(location) {
          return _.intersection(location.attributes[filter.name], filter.selected).length > 0
        }
      };

      var filterFunctions = _($scope.filters).map(filterFunction);
      var filterFunctionMultiplication = function(location) {
        return filterFunctions.every(function(f) {return f(location)})
      };
      $scope.filtered = _($scope.locations).filter(filterFunctionMultiplication).value()
    }
  );

  $scope.$watchCollection(
      function() {
        return _($scope.filters).map('selected').join() + $scope.selectedFilter.name;
      },
      function() {
        var perspective = $scope.selectedFilter;
        _($scope.locations).forEach(function(location) {
          var locationValues = location.attributes[perspective.name];
          var matchedValues = _.intersection(locationValues, perspective.selected);
          var firstValue = matchedValues[0];
          var icon;
          if (firstValue != undefined) {
            var iconIndex = _.indexOf(perspective.values, firstValue);
            if (iconIndex != -1) {
              icon = perspective.icons[iconIndex]
            }
          }
          location.currentIcon = icon;
        })
      }
  );

  // Watch for selection changes
  $scope.$watch(
    function() {
      return _($scope.locations).map('selected').join()
    },
    function(a, b) {
      if (a != b) {
        // TODO: Here we can send selectedIds to the outer system.
        // console.log('selectedIds', selectedIds)
      }
    }
  )
}]);