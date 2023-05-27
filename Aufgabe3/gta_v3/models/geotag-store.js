// File origin: VS1LAB A3

const GeoTagExamples = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    tagList = [];

    constructor(){
        this.tagList = [];
        for(let i = 0; i < GeoTagExamples.tagList.length; i++){
            this.addGeoTag(GeoTagExamples.tagList[i][0], GeoTagExamples.tagList[i][1], GeoTagExamples.tagList[i][2], GeoTagExamples.tagList[i][3]);
        }
    }

    addGeoTag(name, latitude, longitude, hashtag){
        this.tagList.push(new GeoTag(name, latitude, longitude, hashtag));
    }

    removeGeoTag(name){
        for (let i = 0; i < this.tagList.length; i++) {
            if(this.tagList[i].name === name){
                this.tagList.splice(i, 1);
            }
        }
    }

    getNearbyGeoTags(latitude, longitude, radius){
        let nearbyTags = [];
        for (let i = 0; i < this.tagList.length; i++) {
            if(radius >= Math.sqrt(Math.pow(this.tagList[i].latitude - latitude, 2) + Math.pow(this.tagList[i].longitude - longitude, 2))){
                nearbyTags.push(this.tagList[i]);
            }
        }
        return nearbyTags;
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword){
        let nearbyTags = [];
        for (let i = 0; i < this.tagList.length; i++) {
            if(radius >= Math.sqrt(Math.pow(this.tagList[i].latitude - latitude, 2) + Math.pow(this.tagList[i].longitude - longitude, 2))){
                if(this.tagList[i].name.includes(keyword) || this.tagList[i].hashtag.includes(keyword)){
                    nearbyTags.push(this.tagList[i]);
                }
            }
        }
        return nearbyTags;
    }
}

module.exports = InMemoryGeoTagStore
