//This is the javascript file that creates the map for the Police Shooting page

//creates the map using tiles from OpenStreetMap, then calls getData
var drawMap = function() {
  map = L.map('container').setView([38, -100], 5) //centers America on the map
  var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
  layer.addTo(map)
  getData()
}

//collects the data from data/response.json and calls customBuild after a success
var getData = function() {
  $.ajax({
    url: "data/response.json",
    type: "get",
    success: function(data) {
      getData = data,
      customBuild(data);
    },
    dataType: "json"
  });
}

//loops through the data and adds circles to the map in categories based on race, and
//changes color based on whether the victim was hit or killed, then creates a table with
//information on whether or not a victim was killed, and if they were armed
var customBuild = function() {
  var names = [];
  var killArmed = 0;
  var killUnarmed = 0;
  var hitArmed = 0;
  var hitUnarmed = 0;
  var layerNames = [];
  for (var i = 0; i < getData.length; i++) {
    var check = getData[i];
    var num = 0;
    if (check.hasOwnProperty('Race')) {
      if (names.indexOf(check.Race) == -1) {
        names.push(check.Race);
        num = names.indexOf(check.Race);
        layerNames[num] = new L.layerGroup([]);
      }
      num = names.indexOf(check.Race);
    } else {
        if (names.indexOf("Unknown") == -1) {
          names.push("Unknown");
          num = names.indexOf("Unknown");
          layerNames[num] = new L.layerGroup([]);
        }
      num = names.indexOf("Unknown");
    }
    var circle = new L.circleMarker([check.lat, check.lng]);
    circle.options.radius = 8;
    circle.bindPopup(check.Summary);
    if (check['Hit or Killed?'] == 'Killed') {
      if (check['Armed or Unarmed?'] == 'Armed') {
        killArmed++;
      } else if (check['Armed or Unarmed?'] == 'Unarmed') {
        killUnarmed++;
      }
      circle.options.fillColor = "black";
      circle.options.color = "black";
    } else if (check['Hit or Killed?'] == 'Hit') {
      if (check['Armed or Unarmed?'] == 'Armed') {
        hitArmed++;
      } else if (check['Armed or Unarmed?'] == 'Unarmed') {
        hitUnarmed++;
      }
      circle.options.fillColor = "red";
      circle.options.color = "red";
    }
    circle.addTo(layerNames[num]);
  }
  var layers = {};
  for (var i = 0; i < layerNames.length; i++) {
    layerNames[i].addTo(map);
    layers[names[i]] = layerNames[i];   
  }
  $('#hitArmed').prepend(hitArmed);
  $('#killArmed').prepend(killArmed);
  $('#hitUnarmed').prepend(hitUnarmed);
  $('#killUnarmed').prepend(killUnarmed);
  L.control.layers(null, layers).addTo(map); 
}