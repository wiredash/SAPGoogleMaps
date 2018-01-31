angular.module('mapMe').directive('map', function() {
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(49.247862, -123.075458),
    disableDefaultUI: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_CENTER
    },
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.MEDIUM,
      position: google.maps.ControlPosition.RIGHT_CENTER
    }
  };

  return {
    restrict: 'AE',
    controller: function() {},
    link: function(scope, element, attrs) {
      var el = document.createElement("div");
      el.style.width = "100%";
      el.style.height = "100%";
      element.prepend(el);
      mapOptions.center = new google.maps.LatLng(scope.currentLocation[0], scope.currentLocation[1]),
      scope.map = new google.maps.Map(el, mapOptions);

      var bounds = new google.maps.LatLngBounds();
      var infoWindow = new google.maps.InfoWindow();

      _(scope.locations).each(function(location) {
        var position = new google.maps.LatLng(location.lat, location.lng);
        var marker = new google.maps.Marker({position: position, map: scope.map});
        location.marker = marker;
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent('<div id="content"><h4>' + location.title + '</h4></div><div id="inf">' + location.content + '</div>');
          infoWindow.open(scope.map, marker);
          scope.map.panTo(position);
        });
        bounds.extend(position);
      });

      var redraw = function() {
        var perspective = scope.selectedFilter;
        _(scope.locations).forEach(function(location) {
          if (location.selected) {
            location.marker.setIcon('https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.5|0|FFEF92|10|b|Selected');
          } else {
            if (location.currentIcon != undefined) {
              location.marker.setIcon(location.currentIcon);
            } else {
              location.marker.setIcon('https://www.google.com/mapfiles/marker.png');
            }
          }
        });
      };

      scope.$watch(function() {
        return _(scope.locations).map('selected').join() + _(scope.locations).map('currentIcon').join()
      }, function(a, b) {
        redraw()
      });

      scope.$watchCollection('filtered', function(filtered) {
        _(scope.locations).forEach(function(location) {
          location.marker.setVisible(_(scope.filtered).contains(location))
        })
      });

      scope.map.fitBounds(bounds);
      scope.map.panToBounds(bounds);
    }
  }
});
