# SAPGoogleMaps
SAP Geo Spatial Scheduling

![App Screenshot](https://github.com/wiredash/SAPGoogleMaps/blob/master/APPSC.png)

An AngularJS application that allows SAP PM Work Scheduling to occur on the basis of Geo Spatial data. In other words, schedulers can can view PM work orders on a Google Map and select multiple oprations for assignment to the same work center.

## Selecting Operations
The app is designed to go into selection mode when the user keeps the SHIFT + Left Mouse Click button pressed while dragging the mouse over the markers to be selected

## Data Format
This index.html in this repo, contains a section of JSON data. This can be broken into the "location" object and the "filter" object.

### Location Sample
``` 
      {
        id: 1,
        title: 'W0112129-0001',
        content: '<b>Operation:</b>&nbsp;0001',
        lat:   49.224181815000,
        lng:  -123.07598010000,
        selected: false,
        attributes: {
          weekdays: ['monday', 'sunday'],
          work_type: ['customer_driven']
        } 
 ```
The "Location" data contains a list of operations that can be displayed and selected on the map. Here is a list of some pointers for mapping your data:

- ID: A unique value field for identification of marker on map.
- Title: This is a text field that would typically contain order information but any other semantic information about the Order can also be sent here
- Content: This is the data that would show up on click of a map marker
- Lat: Latitude
- Lng: Longitude
- Selected: Application state variable but can be set to true if you'd like the marker to be in selected state by default
- Attributes: Contains a list of arrays that contain operation attribute that correlate to Filter values in the section below


### Filter Sample
```
{
        name: 'work_type',
        type: 'exclusive',
        selected: ['customer_driven', 'something_else'],
        values: ['customer_driven', 'something_else'],
        icons: ['https://maps.google.com/mapfiles/marker_green.png', 'https://maps.google.com/mapfiles/marker_purple.png']
      }
```
"Filter" data is a section of data that controls the filters a user can select operations by. The entire section is dynamic as can be seen above, the example describes data for the "Work_type" filter which would allow for two values "Customer Driven" and "Something Else". Here is a list of some pointers for mapping your data
- Name: Is the name of the filter. We had this driven off custom configuration tables from SAP which worked nicely to provide a great deal of extensibility to the User Experience
- Type: Exclusive or Inclusive would result in filter options showing up with either radiobuttons or Check Boxes
- Selected: These are the values that would be checked by default
- Values: These are the list of all possible values. Your operations must use values from within this list to be findable on the map control

That's it folks. Hopefully the code would make this self explanatory and I also doubt that this code will ever really be used by anyone- but if anyone does look for a protoype of this, perhaps this may come in handy someday.
