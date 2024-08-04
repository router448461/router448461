window.onload = function() {
    var map = L.map('map', {
        zoomControl: false,
        dragging: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        worldCopyJump: false, // Prevent repeated parts of the world
        maxBounds: [[-90, -180], [90, 180]], // Set bounds to prevent repeated parts
        maxBoundsViscosity: 1.0 // Ensure the map stays within bounds
    }).setView([20, 0], 2); // Adjusted zoom level to fit the world map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: ''
    }).addTo(map);

    map.on('zoomend', function() {
        map.setZoom(2); // Adjusted zoom level to fit the world map
    });

    map.scrollWheelZoom.disable();

    var ipCoords = [37.7749, -122.4194];
    var doverCoords = [-43.3167, 147.0167];

    var nameServers = [
        'ns8.dynu.com',
        'ns9.dynu.com',
        'ns7.dynu.com',
        'ns1.dynu.com',
        'ns5.dynu.com',
        'ns2.dynu.com',
        'ns4.dynu.com',
        'ns3.dynu.com',
        'ns6.dynu.com',
        'ns12.dynu.com',
        'ns10.dynu.com',
        'ns11.dynu.com'
    ];

    var nameServerCoords = [
        [51.5074, -0.1278],
        [48.8566, 2.3522],
        [52.5200, 13.4050],
        [34.0522, -118.2437],
        [35.6895, 139.6917],
        [55.7558, 37.6173],
        [40.730610, -73.935242],
        [39.9042, 116.4074],
        [28.6139, 77.2090],
        [37.5665, 126.9780],
        [31.2304, 121.4737],
        [22.3964, 114.1095]
    ];

    var polyline = L.polyline([], {color: 'blue', weight: 1}).addTo(map);

    var latlngs = [ipCoords].concat(nameServerCoords).concat([doverCoords]);
    var totalDuration = 30000; // 30 seconds
    var steps = 100; // Number of steps for the animation
    var interval = totalDuration / steps;
    var step = 0;

    var drawLine = setInterval(function() {
        if (step < steps) {
            var currentIndex = Math.floor(step / (steps / latlngs.length));
            var nextIndex = currentIndex + 1;
            if (nextIndex < latlngs.length) {
                var lat = latlngs[currentIndex][0] + (latlngs[nextIndex][0] - latlngs[currentIndex][0]) * ((step % (steps / latlngs.length)) / (steps / latlngs.length));
                var lng = latlngs[currentIndex][1] + (latlngs[nextIndex][1] - latlngs[currentIndex][1]) * ((step % (steps / latlngs.length)) / (steps / latlngs.length));
                polyline.addLatLng([lat, lng]);
            }
            step++;
        } else {
            clearInterval(drawLine);
        }
    }, interval);

    var ipInfo = document.getElementById('ip-info');
    ipInfo.style.color = 'white';

    // Function to convert name servers to IP addresses
    function getIP(nameServer) {
        return fetch(`https://dns.google/resolve?name=${nameServer}`)
            .then(response => response.json())
            .then(data => `${nameServer}: ${data.Answer[0].data}`)
            .catch(error => console.error('Error:', error));
    }

    // Convert name servers to IP addresses and display them
    Promise.all(nameServers.map(getIP)).then(ipAddresses => {
        ipInfo.innerHTML = ipAddresses.join('<br>');
    });

    var coords = [ipCoords].concat(nameServerCoords).concat([doverCoords]);
    coords.forEach(function(coord, index) {
        var dot = L.divIcon({
            className: 'dot',
            html: `<div style="background-color: ${index < 1 ? 'green' : 'red'}; width: 1px; height: 1px; border-radius: 50%; animation: blink 1s infinite;"></div>`
        });
        L.marker(coord, { icon: dot }).addTo(map);
    });

    var greenDot = L.divIcon({
        className: 'dot',
        html: '<div style="background-color: green; width: 1px; height: 1px; border-radius: 50%; animation: blink 1s infinite;"></div>'
    });
    L.marker(doverCoords, { icon: greenDot }).addTo(map);

    var lineVertical = document.getElementById('line-vertical');
    var lineHorizontal = document.getElementById('line-horizontal');
    var lineVerticalBottom = document.getElementById('line-vertical-bottom');
    var lineHorizontalRight = document.getElementById('line-horizontal-right');
    var whiteFlash = document.getElementById('white-flash');

    lineVertical.style.animation = 'lineMoveVertical 7.5s linear forwards, stayVisible 7.5s linear 7.5s forwards, createTriangle 30s linear forwards';
    lineHorizontal.style.animation = 'lineMoveHorizontal 7.5s linear forwards, stayVisible 7.5s linear 7.5s forwards, createTriangle 30s linear forwards';
    lineVerticalBottom.style.animation = 'lineMoveVerticalBottom 7.5s linear forwards, stayVisible 7.5s linear 7.5s forwards, createTriangle 30s linear forwards';
    lineHorizontalRight.style.animation = 'lineMoveHorizontalRight 7.5s linear forwards, stayVisible 7.5s linear 7.5s forwards, createTriangle 30s linear forwards';

    setTimeout(function() {
        whiteFlash.style.opacity = 1;
        setTimeout(function() {
            whiteFlash.style.opacity = 0;
        }, 500);
    }, 7500);

    setTimeout(function() {
        whiteFlash.style.opacity = 1;
        setTimeout(function() {
            whiteFlash.style.opacity = 0;
        }, 500);
    }, 30000);

    setTimeout(function() {
        location.reload();
    }, 60000);

    // Add the red triangle at the center
    var triangle = document.createElement('div');
    triangle.id = 'triangle';
    document.body.appendChild(triangle);
};
