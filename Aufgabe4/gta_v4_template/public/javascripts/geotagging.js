// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

document.addEventListener("click", updateLocation);
var url = "http.//localhost:3000/api/geotags";
fetch(url, {
   
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
})

    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));


fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));


function updateLocation() {

    const mapManager = new MapManager("ZhW8DBs08y2UnuQno5jfjSTbKDrSeoUd");

    //Get lat and long fields
    const latitudeBox = document.getElementById("latitude");
    const longitudeBox = document.getElementById("longitude");
    const latitudeBoxHidden = document.getElementById("latitude_hidden");
    const longitudeBoxHidden = document.getElementById("longitude_hidden");

    // Get the map image element from the DOM.
    const mapImage = document.getElementById("mapView");

    var latitude = latitudeBox.value;
    var longitude = longitudeBox.value;

    // Checks DOM if latitude and lognitude are empty
    if (latitude === "" && longitude === "") {
        LocationHelper.findLocation((location) => {
            // Sets found location
            latitude = location.latitude;
            longitude = location.longitude;

            // Update the latitude and longitude values in the Tagging and Discovery sections.
            latitudeBox.value = latitude;
            longitudeBox.value = longitude;
            latitudeBoxHidden.value = latitude;
            longitudeBoxHidden.value = longitude;

            // Get the map URL using the MapManager class.
            const mapUrl = mapManager.getMapUrl(latitude, longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));

            // Set the map URL in the map image element.
            mapImage.src = mapUrl;
        });
    } else {
        // Update the latitude and longitude values in the Tagging and Discovery sections.
        latitudeBox.value = latitude;
        longitudeBox.value = longitude;
        latitudeBoxHidden.value = latitude;
        longitudeBoxHidden.value = longitude;

        // Get the map URL using the MapManager class.
        const mapUrl = mapManager.getMapUrl(latitude, longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));

        // Set the map URL in the map image element.
        mapImage.src = mapUrl;
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);