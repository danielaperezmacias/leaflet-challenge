
  document.addEventListener("DOMContentLoaded", function () {
    // Fetch the earthquake data
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
      // Call the function to create the map and plot the earthquakes
      createMap(data);
    });
  });
  
  function createMap(earthquakeData) {
    // Create the Leaflet map centered on a location of your choice (e.g., [latitude, longitude])
    const myMap = L.map("map").setView([0, 0], 2);
  
    // Add a tile layer to the map to display the map background (e.g., OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);
  
    // Loop through the earthquake data and create circle markers for each earthquake
    earthquakeData.features.forEach(function (feature) {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
  
      // Function to determine the marker color based on earthquake depth
      function getMarkerColor(depth) {
        // Define your color logic here based on depth ranges
        // Example:
        if (depth < 10) {
          return "green";
        } else if (depth < 50) {
          return "orange";
        } else {
          return "red";
        }
      }
  
      // Function to determine the marker size based on earthquake magnitude
      function getMarkerSize(magnitude) {
        // Define your size logic here based on magnitude range
        // Example:
        return magnitude * 5;
      }
  
      // Create the circle marker and add it to the map
      L.circleMarker([coordinates[1], coordinates[0]], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(depth),
        color: "gray",
        fillOpacity: 0.7,
      })
        .bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth}<br><b>Location:</b> ${feature.properties.place}`)
        .addTo(myMap);
    });
  
    // Create a legend for the map to provide context for the marker size and color
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      // Create a div with a class "legend"
      const div = L.DomUtil.create("div", "legend");
  
      // Add legend content (HTML)
      div.innerHTML = `
        <p><b>Legend</b></p>
        <p><i style="background:green;">&nbsp;&nbsp;</i> Depth &lt; 10 km</p>
        <p><i style="background:orange;">&nbsp;&nbsp;</i> 10 km &le; Depth &lt; 50 km</p>
        <p><i style="background:red;">&nbsp;&nbsp;</i> Depth &ge; 50 km</p>
      `;
  
      return div;
    };
    legend.addTo(myMap);
  }
  