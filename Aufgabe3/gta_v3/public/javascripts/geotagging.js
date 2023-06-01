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
function updateLocation() {
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    // Checks DOM if latitude and lognitude are empty
    if (latitude === "" && longitude === "") {
        LocationHelper.findLocation((location) => {
            latitude = location.latitude;
            longitude = location.longitude;
            // Update the latitude and longitude values in the Tagging and Discovery sections.
            document.getElementById("latitude").value = latitude;
            document.getElementById("longitude").value = longitude;
            document.getElementById("latitude_hidden").value = latitude;
            document.getElementById("longitude_hidden").value = longitude;

            // Get the map URL using the MapManager class.
            const mapManager = new MapManager("ZhW8DBs08y2UnuQno5jfjSTbKDrSeoUd");
            const mapUrl = mapManager.getMapUrl(latitude, longitude);

            // Get the map image element from the DOM.
            const mapImage = document.getElementById("mapView");

            // Set the map URL in the map image element.
            mapImage.src = mapUrl;
        });
    } else {
        // Update the latitude and longitude values in the Tagging and Discovery sections.
        document.getElementById("latitude").value = latitude;
        document.getElementById("longitude").value = longitude;
        document.getElementById("latitude_hidden").value = latitude;
        document.getElementById("longitude_hidden").value = longitude;

        // Get the map URL using the MapManager class.
        const mapManager = new MapManager("ZhW8DBs08y2UnuQno5jfjSTbKDrSeoUd");
        const mapUrl = mapManager.getMapUrl(latitude, longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));
        //console.log(document.getElementById("mapView").getAttribute("data-tags"));
        // Get the map image element from the DOM.
        const mapImage = document.getElementById("mapView");

        // Set the map URL in the map image element.
        mapImage.src = mapUrl;
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);