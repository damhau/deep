var adminLevels = {};
var adminLevelNames = {};
var adminLevelPropNames = {};
var currentLevel = 0;
var selectedCountry = "";
var layer;

var map = L.map('the-map').setView([27.7, 85.3], 6);
// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// On country selected, fetch the admin levels data.
$("#country").on('change', function(e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    if (valueSelected != "") {
        selectedCountry = valueSelected;
        refreshAdminLevels();
        getAdminLevels(valueSelected);
    }
});


function getAdminLevels(countryCode) {
    $.getJSON("/api/v1/countries/"+countryCode, function(data) {
        levels = Object.keys(data["admin_levels"]);
        levels.sort();

        // Fill the admin level data in the appropriate arrays.
        adminLevels[countryCode] = [];
        adminLevelNames[countryCode] = [];
        adminLevelPropNames[countryCode] = [];

        for (var i=0; i<levels.length; ++i) {
            var level = data["admin_levels"][levels[i]];
            adminLevelNames[countryCode].push(level[0]);
            adminLevelPropNames[countryCode].push(level[1]);
            // adminLevels[countryCode].push(JSON.parse(level[2]));

            adminLevels[countryCode].push(null);

            var jsonadder = function(countryCode, index) {
                return function(kdata){
                    console.log("got geojson");
                    adminLevels[countryCode][index] = kdata;
                    refreshAdminLevels();
                }
            }(countryCode, adminLevels[countryCode].length-1);

            $.getJSON(level[2], jsonadder);
        }

        refreshAdminLevels();
    });
}


function onEachMapFeature(feature, layer) {
    var isSelected = false;

    var propName = adminLevelPropNames[selectedCountry][currentLevel];
    var name = "";
    if (feature.properties && feature.properties[propName]) {
        name = feature.properties[propName];
    }

    var color1 = getColor(50, 50);  // default color
    var color2 = getColor(30, 70);  // mouse-hover color
    var color3 = getColor(5, 5);    // selection-color;

    var selectionName = selectedCountry+":"+currentLevel+":"+name;

    layer.setStyle({
        fillColor: (mapSelections.indexOf(selectionName) == -1)?color1:color3,
        color: 'white',
    });

    layer.on('mouseover', function() {
        this.setStyle({
            fillColor: color2
        });
    });
    layer.on('mouseout', function() {
        this.setStyle({
            fillColor: (mapSelections.indexOf(selectionName) == -1)?color1:color3
        });
    });

    layer.on('click', function() {

        var index = mapSelections.indexOf(selectionName);
        if (index == -1) {
            mapSelections.push(selectionName);
        }
        else {
            mapSelections.splice(index, 1);
        }

        this.setStyle({
            fillColor: (index == -1) ? color3 : color1
        });
    });

    layer.bindLabel(name);

    // var polygonCenter = layer.getBounds().getCenter();
    // L.marker(polygonCenter)
    //     .bindLabel(name, { noHide: true })
    //     .addTo(map);

    // var label = L.marker(layer.getBounds().getCenter(), {
    //   icon: L.divIcon({
    //     className: 'label',
    //     html: name,
    //     iconSize: [100, 40]
    //   })
    // }).addTo(map);
}


function refreshMap() {
    if (layer) {
        layer.clearLayers();
    }

    if (!(selectedCountry in adminLevels)) {
        return;
    }

    if (adminLevels[selectedCountry][currentLevel] == null) {
        return;
    }

    layer = L.geoJson(adminLevels[selectedCountry][currentLevel], {
        onEachFeature: onEachMapFeature
    }).addTo(map);

    $("#admin-level-buttons button").removeClass("btn-primary");
    $("#admin-level-buttons button").addClass("btn-default");
    $("#btn-lvl-"+currentLevel).removeClass("btn-default");
    $("#btn-lvl-"+currentLevel).addClass("btn-primary");

    map.fitBounds(layer.getBounds());
}


function refreshAdminLevels() {
    $("#admin-level-buttons").empty();

    if (selectedCountry in adminLevels) {
        for (var i=0; i<adminLevelNames[selectedCountry].length; ++i) {
            var btn = $("<button id='btn-lvl-" + i + "' class='btn btn-default'>" + adminLevelNames[selectedCountry][i] + "</button>");
            btn.on('click', function(level) { return function() {   // closure shit
                currentLevel = level;
                refreshMap();
            }}(i));
            $("#admin-level-buttons").append(btn);
        }
    }
    refreshMap();
}
