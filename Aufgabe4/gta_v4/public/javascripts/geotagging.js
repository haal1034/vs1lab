// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

const taggingButton = document.getElementById("taggingButton");
const discoveryButton = document.getElementById("discoveryButton");

taggingButton.addEventListener("click", handleTaggingButtonClick);
discoveryButton.addEventListener("click", handleDiscoveryButtonClick);


async function handleTaggingButtonClick() {
    event.preventDefault();
    const form = document.getElementById('tag-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const name = document.getElementById("name").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const hashtag = document.getElementById("hashtag").value;

    const response = await fetch(`/api/geotags`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            latitude: latitude,
            longitude: longitude,
            hashtag: hashtag
        })
    });
    const data = await response.json();
    console.log(response);
    let geotaglist;

    fetch('/api/geotags')
        .then(response => response.json())
        .then(data => {
            geotaglist = data;
            refreshElements(geotaglist);
        });
}

async function handleDiscoveryButtonClick() {
    event.preventDefault();
    const form = document.getElementById('discoveryFilterForm');
    if (!form.checkValidity()) {
        form.reportValidity();
    }
    const name = document.getElementById("search").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    const url = `/api/geotags?name=${name}&latitude=${latitude}&longitude=${longitude}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            refreshElements(data);
            console.log(data);
        });
}

function refreshElements(geotaglist) {
    const ul = document.getElementById('discoveryResults');
    ul.innerHTML = "";
    for (const tag of geotaglist) {
        const li = document.createElement("li");
        li.textContent = `${tag.name} (${tag.latitude},${tag.longitude}) ${tag.hashtag}`;
        ul.appendChild(li);
    }
    const mapviewdata = document.getElementById("mapView");
    mapviewdata.setAttribute("data-tags", JSON.stringify(geotaglist));
    updateLocation();
}


function updateLocation() {
    const mapManager = new MapManager("ZhW8DBs08y2UnuQno5jfjSTbKDrSeoUd");

    const latitudeBox = document.getElementById("latitude");
    const longitudeBox = document.getElementById("longitude");
    const latitudeBoxHidden = document.getElementById("latitude_hidden");
    const longitudeBoxHidden = document.getElementById("longitude_hidden");

    const mapImage = document.getElementById("mapView");

    var latitude = latitudeBox.value;
    var longitude = longitudeBox.value;

    if (latitude === "" && longitude === "") {
        LocationHelper.findLocation((location) => {
            latitude = location.latitude;
            longitude = location.longitude;
            latitudeBox.value = latitude;
            longitudeBox.value = longitude;
            latitudeBoxHidden.value = latitude;
            longitudeBoxHidden.value = longitude;
            const mapUrl = mapManager.getMapUrl(latitude, longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));
            mapImage.src = mapUrl;
        });
    } else {
        latitudeBox.value = latitude;
        longitudeBox.value = longitude;
        latitudeBoxHidden.value = latitude;
        longitudeBoxHidden.value = longitude;
        const mapUrl = mapManager.getMapUrl(latitude, longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));
        mapImage.src = mapUrl;
    }
}
document.addEventListener("DOMContentLoaded", updateLocation);