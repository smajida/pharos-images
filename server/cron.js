"use strict";

// How often queries should be performed
const QUERY_RATE = 5000;

module.exports = (core) => ({
    updateArtworkImport() {
        const advance = () => core.models.ArtworkImport.advance(() =>
            setTimeout(advance, QUERY_RATE));

        advance();
    },

    updateImageImport() {
        const advance = () => core.models.ImageImport.advance(() =>
            setTimeout(advance, QUERY_RATE));

        advance();
    },

    updateImageSimilarity() {
        const Image = core.models.Image;
        const next = () => setTimeout(update, QUERY_RATE);
        const update = () => Image.indexSimilarity((err, success) => {
            // If we hit an error attempt again after a small delay
            /* istanbul ignore if */
            if (err) {
                return next();
            }

            // If it worked immediately attempt to index or update
            // another image.
            if (success) {
                return process.nextTick(update);
            }

            // If nothing happened attempt to update the similarity
            // of an image instead.
            Image.updateSimilarity((err, success) => {
                // If nothing happened then we wait to try again
                if (err || !success) {
                    return next();
                }

                // If it worked immediately attempt to index or update
                // another image.
                process.nextTick(update);
            });
        });

        update();
    },

    start() {
        this.updateArtworkImport();
        this.updateImageImport();
        this.updateImageSimilarity();
    },
});