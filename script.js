window.onload = function() {
    var map = L.map('map', {
        zoomControl: false,
        dragging: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        worldCopyJump: true,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        touchZoom: false,
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '',
        noWrap: true
    }).addTo(map);

    map.on('zoomend', function() {
        map.setZoom(2);
    });

    map.scrollWheelZoom.disable();

    var ipCoords = [37.7749, -122.4194];
    var doverCoords = [-43.3167, 147.0167];

    var nameServers = [
        'ns8.dynu.com', 'ns9.dynu.com', 'ns7.dynu.com', 'ns1.dynu.com', 'ns5.dynu.com', 'ns2.dynu.com', 'ns4.dynu.com', 'ns3.dynu.com', 'ns6.dynu.com', 'ns12.dynu.com', 'ns10.dynu.com', 'ns11.dynu.com'
    ];

    var nameServerCoords = [
        [51.5074, -0.1278], [48.8566, 2.3522], [52.5200, 13.4050], [34.0522, -118.2437], [35.6895, 139.6917], [55.7558, 37.6173], [40.730610, -73.935242], [39.9042, 116.4074], [28.6139, 77.2090], [37.5665, 126.9780], [31.2304, 121.4737], [22.3964, 114.1095]
    ];

    var polyline = L.polyline([], {color: 'red', weight: 1}).addTo(map);

    var latlngs = [
        doverCoords,
        nameServerCoords[0], // NS8
        nameServerCoords[1], // NS9
        nameServerCoords[2], // NS7
        [doverCoords[0], 180], // Move to the right edge
        [doverCoords[0], -180], // Appear on the left edge
        nameServerCoords[3], // NS1
        nameServerCoords[4], // NS5
        nameServerCoords[5], // NS2
        nameServerCoords[6], // NS4
        nameServerCoords[7], // NS3
        nameServerCoords[8], // NS6
        nameServerCoords[9], // NS12
        nameServerCoords[10], // NS10
        nameServerCoords[11], // NS11
        ipCoords
    ];

    var totalDuration = 30000; // 30 seconds
    var steps = 100;
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
    ipInfo.style.color = 'black';

    function getIP(nameServer) {
        return fetch(`https://dns.google/resolve?name=${nameServer}`)
            .then(response => response.json())
            .then(data => `${nameServer}: ${data.Answer[0].data}`)
            .catch(error => console.error('Error:', error));
    }

    Promise.all(nameServers.map(getIP)).then(ipAddresses => {
        ipAddresses.unshift('router448461.com: 10.0.0.1');
        ipInfo.innerHTML = ipAddresses.join('<br>');
    });

    var coords = [doverCoords].concat(nameServerCoords).concat([ipCoords]);
    coords.forEach(function(coord) {
        var dot = L.divIcon({
            className: 'dot',
            html: `<div style="background-color: green; width: 10px; height: 10px; border-radius: 50%; animation: blink 1s infinite; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"> </div>`
        });
        L.marker(coord, { icon: dot }).addTo(map);
    });

    setTimeout(function() {
        location.reload();
    }, 60000);

    window.addEventListener('resize', function() {
        map.invalidateSize();
    });

    setTimeout(function() {
        map.invalidateSize();
    }, 100);

    // Flash the screen red at 30 seconds
    setTimeout(function() {
        document.body.classList.add('flash-red');
    }, 30000);
};
