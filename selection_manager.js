angular.module('mapMe').directive('selectionManager', function() {
  return {
    restrict: 'AE',
    require: '^map',
    link: function(scope, element, attrs) {
      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        rectangleOptions: {
          strokeColor: "#aa9900",
          strokeWeight: 2,
          fillColor: '#cd9101',
          fillOpacity: 0.05,
          editable:false
        }
      });

      // Watch to make sure that map is initialized.
      scope.$watch('map', function(map) {
        if (map != undefined) {
          google.maps.event.addDomListener(document, 'keydown', function(event) {
            if (event.shiftKey && drawingManager.getDrawingMode() == null) {
              drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
              scope.$apply(function() {
                scope.selectionMode = true;
              })
            }
          });
          google.maps.event.addDomListener(document, 'keyup', function(event) {
            if (!event.shiftKey && drawingManager.getDrawingMode() != null) {
              drawingManager.setDrawingMode(null);
              scope.$apply(function() {
                scope.selectionMode = false;
              })
            }
          });

          google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
            var boundsSelectionArea = new google.maps.LatLngBounds(rectangle.getBounds().getSouthWest(), rectangle.getBounds().getNorthEast());
            _(scope.locations).forEach(function(location) {
              if (location.marker.getVisible() && boundsSelectionArea.contains(location.marker.position)) {
                location.selected = !location.selected;
              }
              rectangle.setMap(null);
            });
            scope.$digest();
          });

          drawingManager.setMap(scope.map);
        }
      })
    }
  }
});