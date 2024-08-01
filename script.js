window.onload = function() {
    var displayArea = document.getElementById('display-area');
    var map = L.map('map', { zoomControl: false, dragging: false, attributionControl: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false }).setView([0, 0], 4); // Set initial zoom level to 4

    // Use a dark mode tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        maxZoom: 19 // Increase max zoom level
    }).addTo(map);

    map.on('zoomend', function() {
        map.setZoom(Math.min(map.getZoom(), 4)); // Limit zoom level to 4
    });

    // Disable mouse wheel scroll
    map.scrollWheelZoom.disable();

    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ip = data.ip.split('.').map(num => ("000" + num).slice(-3)).join('.');
            var dns1 = '1.1.1.3'.split('.').map(num => ("000" + num).slice(-3)).join('.');
            var dns2 = '1.0.0.3'.split('.').map(num => ("000" + num).slice(-3)).join('.');
            displayArea.innerHTML = `<span id="ip-display">${ip}<br>${dns1}<br>${dns2}</span>`;

            // Example coordinates for IP and DNS servers
            // You will need to replace the example coordinates with the actual coordinates of the IP address and DNS servers.
            var ipCoords = [37.7749, -122.4194]; // Replace with actual IP coordinates
            var dns1Coords = [33.6844, -117.8265]; // Replace with actual DNS1 coordinates
            var dns2Coords = [40.7128, -74.0060]; // Replace with actual DNS2 coordinates

            var polyline = L.polyline([ipCoords, dns1Coords, ipCoords, dns2Coords], {color: 'red'}).addTo(map);

            var counter = 0;
            setInterval(function() {
                counter++;
                var latlngs = [ipCoords, dns1Coords, ipCoords, dns2Coords];
                var newLatLngs = latlngs.slice(0, Math.min(counter, latlngs.length));
                polyline.setLatLngs(newLatLngs);

                // Flash IP address and traceroute line
                var ipDisplay = document.getElementById('ip-display');
                ipDisplay.style.visibility = (counter % 2 === 0) ? 'visible' : 'hidden';
                polyline.setStyle({ opacity: (counter % 2 === 0) ? 1 : 0 });

                if (counter >= latlngs.length) {
                    counter = 0;
                }
            }, 1000);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    var lineVertical = document.getElementById('line-vertical');
    lineVertical.style.animation = 'lineMoveVertical 30s linear';
    var lineHorizontal = document.getElementById('line-horizontal');
    lineHorizontal.style.animation = 'lineMoveHorizontal 30s linear';
};
