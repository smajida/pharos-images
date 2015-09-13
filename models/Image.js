var fs = require("fs");
var path = require("path");

var mongoose = require("mongoose");

module.exports = function(lib) {
    var ImageSchema = new lib.db.schema({
        // UUID of the image (Format: SOURCE/IMAGEMD5)
        _id: String,

        // The original extracted data
        extractedArtwork: {type: String, ref: "ExtractedArtwork"},

        // The date that this item was created
        created: {type: Date, "default": Date.now},

        // The date that this item was updated
        modified: {type: Date, es_indexed: true},

        // The source of the image.
        source: {type: String, ref: "Source", es_indexed: true},

        // The name of the downloaded image file
        // (e.g. SOURCE/images/IMAGENAME.jpg)
        imageName: {type: String, es_indexed: true},

        // A unique ID for the image
        // (e.g. SOURCE/IMAGENAME)
        imageID: {type: String, es_indexed: true},

        // Full URL of the original page from where the image came.
        url: String,

        // Dimension of the image, in pixels
        width: Number,
        height: Number,

        // Similar images (as determined by MatchEngine)
        similar: [{
            score: Number,
            target_overlap_percent: Number,
            query_overlap_percent: Number,
            overlay: String,
            image: {type: String, ref: "Image"}
        }]
    });

    /*
    ImageSchema.methods = {
        getOriginalURL: function() {
            return process.env.BASE_DATA_URL +
                (this.source._id || this.source) +
                "/images/" + this.imageName + ".jpg";
        },

        getScaledURL: function() {
            return process.env.BASE_DATA_URL +
                (this.source._id || this.source) +
                "/scaled/" + this.imageName + ".jpg";
        },

        getThumbURL: function() {
            return process.env.BASE_DATA_URL +
                (this.source._id || this.source) +
                "/thumbs/" + this.imageName + ".jpg";
        }
    };
    */

    return ImageSchema;
};