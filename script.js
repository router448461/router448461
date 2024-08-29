window.onload = function() {
    var map = L.map('map', {
        minZoom: 1,
        maxBounds: [
            [-90, -180],
            [90, 180]
        ],
        worldCopyJump: false,
        maxBoundsViscosity: 1.0,
    }).setView([0, 0], 2);

    var tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
        noWrap: true,
        bounds: [
            [-90, -180],
            [90, 180]
        ]
    }).addTo(map);

    var nameServers = [
        '111.220.1.1', // nc1.dns.oss-core.net
        'ns8.dynu.com', // AU, SYDNEY
        'ns9.dynu.com',  // SG, SINGAPORE
        'dawn.ns.cloudflare.com', // San Francisco, USA
        'peter.ns.cloudflare.com' // London, UK
    ];

    var nameServerCoords = [
        [-33.865143, 151.209900], // nc1.dns.oss-core.net
        [-33.865143, 151.209900], // NS 8.DYNU.COM // AU, SYDNEY
        [1.352083, 103.819839],   // NS 9.DYNU.COM // SG, SINGAPORE
        [37.7749, -122.4194],     // dawn.ns.cloudflare.com
        [51.5074, -0.1278]        // peter.ns.cloudflare.com
    ];

    var nameServerLocations = [
        'SYDNEY, AU', // nc1.dns.oss-core.net
        'SYDNEY, AU', // NS 8.DYNU.COM
        'SINGAPORE, SP', // NS 9.DYNU.COM
        'SAN FRANCISCO, US', // dawn.ns.cloudflare.com
        'LONDON, UK' // peter.ns.cloudflare.com
    ];

    function getIP(nameServer) {
        if (nameServer === '111.220.1.1') {
            return Promise.resolve({ ipAddress: nameServer, hostname: 'nc1.dns.oss-core.net' });
        } else if (nameServer === 'dawn.ns.cloudflare.com') {
            return Promise.resolve({ ipAddress: '173.245.58.106', hostname: nameServer });
        } else if (nameServer === 'peter.ns.cloudflare.com') {
            return Promise.resolve({ ipAddress: '173.245.59.136', hostname: nameServer });
        }

        return fetch(`https://dns.google/resolve?name=${nameServer}`)
            .then(response => response.json())
            .then(data => ({ ipAddress: data.Answer[0].data, hostname: nameServer }))
            .catch(error => console.error('Error:', error));
    }

    Promise.all(nameServers.map(function(nameServer, index) {
        return getIP(nameServer).then(result => {
            return { ...result, index, location: nameServerLocations[index] };
        });
    })).then(results => {
        results.forEach(result => {
            var dot = L.divIcon({
                className: 'dot',
                html: `<div style="background-color: #ff0000; width: 10px; height: 10px; border-radius: 50%; animation: blink 1s infinite;"> </div>`
            });
            var marker = L.marker(nameServerCoords[result.index], { icon: dot }).addTo(map);
            var tooltipDirection = result.hostname === 'nc1.dns.oss-core.net' ? "left" : "right";
            var tooltipContent = `IP: ${result.ipAddress}<br>LAT: ${nameServerCoords[result.index][0]}<br>LON: ${nameServerCoords[result.index][1]}<br>${result.hostname.toUpperCase()}<br>${result.location}`;
            marker.bindTooltip(`<span style="color: #ff0000">${tooltipContent}</span>`, { permanent: true, direction: tooltipDirection, offset: [10, 0], className: "myCSSClass" });
        });
    });

    fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            var visitorInfo = document.createElement('div');
            visitorInfo.style.position = 'absolute';
            visitorInfo.style.bottom = '10px';
            visitorInfo.style.right = '10px';
            visitorInfo.style.color = '#ff0000';
            visitorInfo.style.zIndex = '1002';
            visitorInfo.innerHTML = `
                IP: ${data.query}<br>
                Location: ${data.city}, ${data.regionName}, ${data.country}<br>
                Coordinates: ${data.lat}, ${data.lon}
            `;
            document.body.appendChild(visitorInfo);
        })
        .catch(error => console.error('Error:', error));

    setTimeout(function() {
        location.reload();
    }, 300000);

    window.addEventListener('resize', function() {
        map.invalidateSize();
    });

    setTimeout(function() {
        map.invalidateSize();
    }, 100);

    setTimeout(function() {
        var flashLayer = document.getElementById('flash-layer');
        flashLayer.style.backgroundColor = '#ffffff';
        flashLayer.style.transition = 'background-color 0.5s ease-in-out';
        setTimeout(function() {
            flashLayer.style.backgroundColor = 'transparent';
        }, 500);
    }, 3000);
};
