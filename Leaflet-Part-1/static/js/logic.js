
  document.addEventListener("DOMContentLoaded", function () {
    
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
      
      createMap(data);
    });
  });
  
  function createMap(earthquakeData) {
   
    const myMap = L.map("map").setView([0, 0], 2);
  
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);
  
    
    earthquakeData.features.forEach(function (feature) {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
  
      function getMarkerColor(depth) {
        
        
        if (depth < 10) {
          return "green";
        } else if (depth < 50) {
          return "orange";
        } else {
          return "red";
        }
      }
  
    
      function getMarkerSize(magnitude) {
       
        return magnitude * 5;
      }
  
      
      L.circleMarker([coordinates[1], coordinates[0]], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(depth),
        color: "gray",
        fillOpacity: 0.7,
      })
        .bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth}<br><b>Location:</b> ${feature.properties.place}`)
        .addTo(myMap);
    });
  
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      
      const div = L.DomUtil.create("div", "legend");
  
      
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
  