### Code Plan:

1. UI Components:
   1. Full-screen map using Leaflet
   2. Title bar: "USGS Earthquakes - Last 3 Days"
   3. Control panel (top-right corner):
      a. Magnitude filter slider with value display
      b. Time filter slider with value display
      c. Depth visualization toggle
      d. Tectonic plate boundaries toggle
   4. Legend (bottom-right corner)
   5. Loading indicator (center of screen)
   6. Earthquake markers (circles on the map)
   7. Popups for earthquake details

2. Logic:
   1. Data Fetching:
      - Retrieve earthquake data from USGS API for the last 3 days
      - Handle loading state and potential errors

   2. Map Initialization:
      - Set up Leaflet map with OpenStreetMap tiles
      - Center map view on a global scale

   3. Earthquake Rendering:
      - Create circular markers for each earthquake
      - Size and color markers based on magnitude

   4. Filtering Mechanism:
      - Implement magnitude and time range filters
      - Update map in real-time as filters change

   5. Depth Visualization:
      - Toggle between magnitude-based and depth-based coloring

   6. Tectonic Plate Boundaries:
      - Fetch and display plate boundary data on toggle

   7. Interactivity:
      - Show detailed popups on marker click
      - Update slider value displays in real-time

   8. Responsive Design:
      - Ensure layout adapts to different screen sizes

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USGS Earthquakes Map - Enhanced Version</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.3/nouislider.min.css" />
    <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
        .legend {
            line-height: 18px;
            color: #555;
            background: white;
            padding: 6px 8px;
            border-radius: 5px;
        }
        .legend i {
            width: 18px;
            height: 18px;
            float: left;
            margin-right: 8px;
            opacity: 0.7;
        }
        #loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 5px;
            z-index: 1000;
            display: none;
        }
        .map-title {
            position: absolute;
            top: 10px;
            left: 50px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 5px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
        }
        #controls {
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            width: 250px;
        }
        #magnitude-slider, #time-slider {
            margin-top: 10px;
            margin-bottom: 20px;
        }
        .leaflet-popup-content {
            max-height: 300px;
            overflow-y: auto;
        }
        .slider-values {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            font-size: 12px;
        }
    </style>
</head>
<body>
<div id="map"></div>
<div id="loading">Loading earthquake data...</div>
<div class="map-title">USGS Earthquakes - Last 3 Days</div>
<div id="controls">
    <div>
        <label for="magnitude-slider">Magnitude Filter:</label>
        <div id="magnitude-slider"></div>
        <div class="slider-values">
            <span id="mag-min"></span>
            <span id="mag-max"></span>
        </div>
    </div>
    <div>
        <label for="time-slider">Time Filter:</label>
        <div id="time-slider"></div>
        <div class="slider-values">
            <span id="time-min"></span>
            <span id="time-max"></span>
        </div>
    </div>
    <div>
        <label for="depth-filter">
            <input type="checkbox" id="depth-filter"> Show Depth
        </label>
    </div>
    <div>
        <label for="plate-boundaries">
            <input type="checkbox" id="plate-boundaries"> Show Plate Boundaries
        </label>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.3/nouislider.min.js"></script>
<script>
    const map = L.map('map').setView([0, 0], 2);
    let earthquakeLayer, plateBoundariesLayer;
    let earthquakeData;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function getColor(magnitude) {
        return magnitude > 7 ? '#800026' :
            magnitude > 5  ? '#BD0026' :
                magnitude > 3  ? '#E31A1C' :
                    '#FC4E2A';
    }

    function getRadius(magnitude) {
        return magnitude * 2;
    }

    function style(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    function getDateString(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    }

    const endtime = getDateString(0); // Today
    const starttime = getDateString(3); // 3 days ago

    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}`;

    document.getElementById('loading').style.display = 'block';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            earthquakeData = data;
            renderEarthquakes(data);
            setupSliders(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('loading').innerHTML = 'Error loading earthquake data. Please try again later.';
        });

    function renderEarthquakes(data, magFilter = [0, 10], timeFilter = [0, Date.now()]) {
        if (earthquakeLayer) {
            map.removeLayer(earthquakeLayer);
        }

        earthquakeLayer = L.geoJSON(data, {
            filter: function(feature) {
                const mag = feature.properties.mag;
                const time = feature.properties.time;
                return mag >= magFilter[0] && mag <= magFilter[1] &&
                    time >= timeFilter[0] && time <= timeFilter[1];
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, style(feature));
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`
                        <b>${feature.properties.title}</b><br>
                        Time: ${new Date(feature.properties.time).toLocaleString()}<br>
                        Magnitude: ${feature.properties.mag.toFixed(1)}<br>
                        Depth: ${feature.geometry.coordinates[2].toFixed(2)} km<br>
                        <a href="${feature.properties.url}" target="_blank">More info</a>
                    `);
            }
        }).addTo(map);
    }

    function setupSliders(data) {
        const magnitudes = data.features.map(f => f.properties.mag);
        const times = data.features.map(f => f.properties.time);

        const magSlider = document.getElementById('magnitude-slider');
        noUiSlider.create(magSlider, {
            start: [Math.min(...magnitudes), Math.max(...magnitudes)],
            connect: true,
            range: {
                'min': Math.min(...magnitudes),
                'max': Math.max(...magnitudes)
            },
            step: 0.1
        });

        const timeSlider = document.getElementById('time-slider');
        noUiSlider.create(timeSlider, {
            start: [Math.min(...times), Math.max(...times)],
            connect: true,
            range: {
                'min': Math.min(...times),
                'max': Math.max(...times)
            },
            step: 3600000 // 1 hour in milliseconds
        });

        function updateMagValues(values) {
            document.getElementById('mag-min').textContent = Number(values[0]).toFixed(1);
            document.getElementById('mag-max').textContent = Number(values[1]).toFixed(1);
        }

        function updateTimeValues(values) {
            document.getElementById('time-min').textContent = new Date(Number(values[0])).toLocaleString();
            document.getElementById('time-max').textContent = new Date(Number(values[1])).toLocaleString();
        }

        magSlider.noUiSlider.on('update', function (values) {
            updateMagValues(values);
            renderEarthquakes(data, values.map(Number), timeSlider.noUiSlider.get().map(Number));
        });

        timeSlider.noUiSlider.on('update', function (values) {
            updateTimeValues(values);
            renderEarthquakes(data, magSlider.noUiSlider.get().map(Number), values.map(Number));
        });

        // Initial update of values
        updateMagValues(magSlider.noUiSlider.get());
        updateTimeValues(timeSlider.noUiSlider.get());
    }

    document.getElementById('depth-filter').addEventListener('change', function() {
        if (this.checked) {
            earthquakeLayer.eachLayer(function(layer) {
                const depth = layer.feature.geometry.coordinates[2];
                const depthColor = depth < 70 ? '#00ff00' : depth < 300 ? '#ffff00' : '#ff0000';
                layer.setStyle({fillColor: depthColor});
            });
        } else {
            earthquakeLayer.eachLayer(function(layer) {
                layer.setStyle(style(layer.feature));
            });
        }
    });

    document.getElementById('plate-boundaries').addEventListener('change', function() {
        if (this.checked) {
            if (!plateBoundariesLayer) {
                fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
                    .then(response => response.json())
                    .then(data => {
                        plateBoundariesLayer = L.geoJSON(data, {
                            style: {color: '#ff7800', weight: 2}
                        }).addTo(map);
                    });
            } else {
                map.addLayer(plateBoundariesLayer);
            }
        } else if (plateBoundariesLayer) {
            map.removeLayer(plateBoundariesLayer);
        }
    });

    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 3, 5, 7];
        const labels = [];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 0.1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
</script>
</body>
</html>
```

### Explanation:

1. Data Source: We fetch real-time data from the USGS API, covering the last 3 days of earthquake events. This ensures up-to-date information.
2. Map Visualization: Using Leaflet, we create a full-screen map that serves as the primary interface. Earthquake locations are represented by circular markers, with size and color indicating magnitude.
3. Filtering Capabilities: Two key filters are implemented:
   - Magnitude Filter: Users can select a range of earthquake magnitudes to display.
   - Time Filter: Within the 3-day period, users can focus on specific time ranges.
     Both filters use noUiSlider for smooth, interactive range selection, with real-time value displays for user clarity.
4. Depth Visualization: A toggle allows users to switch between magnitude-based coloring and depth-based coloring, providing insight into the vertical distribution of seismic activity.
5. Tectonic Context: Users can overlay tectonic plate boundaries on the map, helping to contextualize earthquake locations with respect to global plate tectonics.
6. Detailed Information: Clicking on any earthquake marker opens a popup with comprehensive details, including magnitude, location, depth, time, and a link to the USGS page for more information.
7. User Interface: The control panel is positioned for easy access, with clear labels and intuitive controls. The legend provides a quick reference for interpreting the map.
8. Responsiveness: The layout is designed to be responsive, ensuring usability across various device sizes.
9. Error Handling: We implement error catching for data fetching and display user-friendly messages in case of issues.

This implementation creates a powerful tool for visualizing and exploring recent earthquake data.