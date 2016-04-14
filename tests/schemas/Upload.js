"use strict";

const tap = require("tap");

const init = require("../init");
const req = init.req;

tap.test("getURL", {autoend: true}, (t) => {
    const upload = init.getUpload();
    t.equal(upload.getURL("en"),
        "/uploads/4266906334", "Check 'en' URL");

    t.equal(upload.getURL("de"),
        "/uploads/4266906334?lang=de", "Check 'de' URL");
});

tap.test("getThumbURL", {autoend: true}, (t) => {
    const upload = init.getUpload();
    t.equal(upload.getThumbURL(),
        "/data/uploads/thumbs/4266906334.jpg",
        "Check Thumb URL");
});

tap.test("getTitle", {autoend: true}, (t) => {
    const upload = init.getUpload();
    t.equal(upload.getTitle(req), "Uploaded Image", "Check Title");
});

tap.test("updateSimilarity", (t) => {
    const upload = init.getUpload();
    upload.updateSimilarity((err) => {
        t.error(err, "Error should be empty.");
        t.equal(upload.similarArtworks.length, 1,
            "Correct number of matches.");
        t.same(upload.similarArtworks[0].toJSON(), {
            _id: "test/1235",
            artwork: "test/1235",
            score: 10,
            source: "test",
            images: ["test/bar.jpg"],
        }, "Check similar upload result");
        t.end();
    });
});

tap.test("updateSimilarity with no similar", (t) => {
    const upload = init.getUpload();
    const uploadImage = init.getUploadImage();
    uploadImage.similarImages = [];

    upload.updateSimilarity((err) => {
        t.error(err, "Error should be empty.");
        t.equal(upload.similarArtworks.length, 0,
            "Correct number of matches.");
        t.end();
    });
});
