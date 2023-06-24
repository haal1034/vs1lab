// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const tagStorage = new GeoTagStore();

// App routes (A3)
router.get('/', (req, res) => {
  res.render('index', { taglist: tagStorage.tagList, latitude: "", longitude: ""  })
});

router.post('/tagging', (req, res) => {
  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const hashtag = req.body.hashtag;

  tagStorage.addGeoTag(name, latitude, longitude, hashtag);
  res.render('index', {
    taglist: tagStorage.getNearbyGeoTags(latitude, longitude, 100),
    latitude: latitude,
    longitude: longitude
  });
});

router.post('/discovery', (req, res) => {
  const latitude = req.body.latitude_hidden;
  const longitude = req.body.longitude_hidden;
  const searchTerm = req.body.search;
  res.render('index', {
    taglist: tagStorage.searchNearbyGeoTags(latitude, longitude, 100, searchTerm),
    latitude: latitude,
    longitude: longitude
  });
});
module.exports = router;

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  let filter = req.query.filter; // Nehmen Sie den Filter-Parameter aus der URL

  // Führen Sie die erforderlichen Aktionen aus, um GeoTags basierend auf dem Filter zu suchen
  let filteredGeoTags = tagStorage.searchNearbyGeoTags(48,98770, 8,38080, 1000, "Castle");

  // Senden Sie die Antwort mit den gefundenen GeoTags als JSON-Array
  res.json(filteredGeoTags);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// Route zum Anlegen neuer GeoTags
router.post('/api/geotags', (req, res) => {
  const newGeoTag = req.body; // Nehmen Sie die JSON-Daten aus dem Request-Body

  // Führen Sie die erforderlichen Aktionen aus, um einen neuen GeoTag zu erstellen
  tagStorage.addGeoTag(newGeoTag.name, newGeoTag.latitude, newGeoTag.longitude, newGeoTag.hashtag);

  // Senden Sie die Antwort mit dem Statuscode 201 und der URI des erstellten GeoTags
  res.status(201).location(`/api/geotags/${newGeoTag.name}`).json(newGeoTag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// Route zum Lesen einer einzelnen GeoTag-Ressource
router.get('/api/geotags/:name', (req, res) => {
  const name = req.params.name; // Nehmen Sie den Namen des GeoTags aus der URL

  // Führen Sie die erforderlichen Aktionen aus, um den GeoTag mit dem angegebenen Namen zu lesen
  const geoTag = tagStorage.tagList.find(tag => tag.name === name);

  if (geoTag) {
    // Senden Sie die Antwort mit dem gefundenen GeoTag als JSON
    res.json(geoTag);
  } else {
    // Senden Sie eine Fehlerantwort mit dem Statuscode 404, wenn der GeoTag nicht gefunden wurde
    res.status(404).json({ error: 'GeoTag not found' });
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:name', (req, res) => {
  const name = req.params.name; // Nehmen Sie den Namen des GeoTags aus der URL
  const updatedGeoTag = req.body; // Nehmen Sie die JSON-Daten aus dem Request-Body

  // Führen Sie die erforderlichen Aktionen aus, um den GeoTag mit dem angegebenen Namen zu aktualisieren
  const geoTagIndex = tagStorage.tagList.findIndex(tag => tag.name === name);

  if (geoTagIndex !== -1) {
    tagStorage.tagList[geoTagIndex] = updatedGeoTag;
    // Senden Sie die Antwort mit dem aktualisierten GeoTag als JSON
    res.json(updatedGeoTag);
  } else {
    // Senden Sie eine Fehlerantwort mit dem Statuscode 404, wenn der GeoTag nicht gefunden wurde
    res.status(404).json({ error: 'GeoTag not found' });
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:name', (req, res) => {
  const name = req.params.name; // Nehmen Sie den Namen des GeoTags aus der URL

  // Führen Sie die erforderlichen Aktionen aus, um den GeoTag mit dem angegebenen Namen zu löschen
  const geoTagIndex = tagStorage.tagList.findIndex(tag => tag.name === name);

  if (geoTagIndex !== -1) {
    tagStorage.tagList.splice(geoTagIndex, 1);
    // Senden Sie eine Erfolgsantwort mit dem Statuscode 204 (No Content)
    res.sendStatus(204);
  } else {
    // Senden Sie eine Fehlerantwort mit dem Statuscode 404, wenn der GeoTag nicht gefunden wurde
    res.status(404).json({ error: 'GeoTag not found' });
  }
});

module.exports = router;
