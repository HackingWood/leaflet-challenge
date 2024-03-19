d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson').then(function(data) {
    // Create a Leaflet map centered at a specific location
    var map = L.map('map').setView([0, 0], 2);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define depth ranges and corresponding colors for legend
    var depthRanges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    var colors = ['#14ff00', '#6dee00', '#97db00', '#b1c800', '#c6b400', '#d79f00', '#e78600', '#f46900', '#fc4700', '#ff0000'];

    // Iterate through each earthquake feature
    data.features.forEach(function(feature) {
        // Extract earthquake coordinates
        var coordinates = feature.geometry.coordinates;
        var latitude = coordinates[1];
        var longitude = coordinates[0];
        
        // Determine marker size based on magnitude
        var markerSize = feature.properties.mag * 4; 

        // Determine marker color based on depth
        var depth = coordinates[2];
        var markerColor = getColor(depth);

        // Create a Leaflet circle marker for each earthquake
        L.circleMarker([latitude, longitude], {
            radius: markerSize,
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.7
        }).addTo(map)
        .bindPopup('<b>Magnitude:</b> ' + feature.properties.mag + '<br><b>Location:</b> ' + feature.properties.place + '<br><b>Depth:</b> ' + depth + ' km');
    });

    // Create a legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<h4>Depth Legend</h4>';
        for (var i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + ' km<br>' : '+ km');
        }
        return div;
    };

    legend.addTo(map);

    // Function to determine marker color based on depth
    function getColor(depth) {
        // Iterate through depth ranges and return corresponding color
        for (var i = 0; i < depthRanges.length - 1; i++) {
            if (depth >= depthRanges[i] && depth < depthRanges[i + 1]) {
                return colors[i];
            }
        }
        return colors[colors.length - 1]; 
    }
});
