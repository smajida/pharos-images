"use strict";

const yearRange = require("yearrange");

const db = require("../lib/db");

const YearRange = require("./YearRange");

const Name = new db.schema({
    // An ID for the name, computed from the original + name properties
    // before validation.
    _id: String,

    // The original string from which the rest of the values were derived
    original: String,

    // The locale for the string (e.g. 'en', 'ja')
    locale: String,

    // Any sort of name parsing options
    settings: db.schema.Types.Mixed,

    // The English form of the full artist's name
    name: {
        type: String,
        es_indexed: true,
        es_type: "multi_field",
        // A raw name to use for building aggregations in Elasticsearch
        es_fields: {
            name: {type: "string", index: "analyzed"},
            raw: {type: "string", index: "not_analyzed"},
        },
        required: true,
    },

    // Same but in ascii (for example: Hokushō becomes Hokushoo)
    ascii: String,

    // Same but with diacritics stripped (Hokushō becomes Hokusho)
    plain: {type: String, es_indexed: true},

    // The English form of the middle name
    middle: String,

    // The English form of the surname
    surname: String,

    // A number representing the generation of the artist
    generation: Number,

    // A pseudonym for the person
    pseudonym: {type: String, es_indexed: true},

    // Is the artist unknown/unattributed
    unknown: Boolean,

    // Is this artist part of a school
    school: Boolean,

    // Was this work done in the style of, or after, an artist
    after: Boolean,

    // Is this work attributed to an artist
    attributed: Boolean,

    // Date when the name was used
    dates: {
        type: [YearRange],
        convert: (obj) => typeof obj === "string" ?
            yearRange.parse(obj) : obj,
        validateArray: (val) => val.start || val.end,
        validationMsg: (req) => req.gettext("Dates must have a start or " +
            "end specified."),
    },
});

// Dynamically generate the _id attribute
Name.pre("validate", function(next) {
    this._id = this.original || this.name;
    next();
});

module.exports = Name;
