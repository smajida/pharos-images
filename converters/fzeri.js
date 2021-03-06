"use strict";

const concat = require("concat-stream");
const libxmljs = require("libxmljs");

const types = {
    "dipinto": "painting",
    "grafica": "print",
    "mosaico": "mosaic",
    "scultura/ arti applicate": "decorative arts",
    "arti applicate": "decorative arts",
    "scultura": "sculpture",
    "dipinto/ scultura": "painting",
    "disegno": "drawing",
};

const propMap = {
    id: "SERCD",
    url: [
        "SERCD",
        (val) => `http://catalogo.fondazionezeri.unibo.it/scheda.jsp?` +
            `decorator=layout_S2&apply=true&tipo_scheda=OA&id=${val}`,
    ],
    title: "SGTI",
    dates: ["DTSI", (start, getByTagName) => {
        if (start) {
            return [{
                label: getByTagName("DTZG"),
                start: parseFloat(start),
                end: parseFloat(getByTagName("DTSF")),
                circa: !!(getByTagName("DTSV") || getByTagName("DTSL")),
            }];
        }
    }],
    medium: "MTC",
    objectType: [
        "OGTT",
        (val, getByTagName) => {
            let result = types[val] || val;
            // Special-case frescos
            if (result === "painting" &&
                    /affresco/i.test(getByTagName("MTC"))) {
                result = "fresco";
            }
            return result;
        },
    ],
    dimensions: [
        "MISU",
        (unit, getByTagName) => {
            if (unit) {
                const diameter = getByTagName("MISD");
                if (diameter) {
                    return [`${diameter}${unit} x ${diameter}${unit}`];
                }

                return [`${getByTagName("MISA")}${unit} x ` +
                    `${getByTagName("MISL")}${unit}`];
            }
        },
    ],
    locations: ["LDCN", (name, getByTagName) => {
        if (name) {
            return [{
                name,
                country: getByTagName("PVCS"),
                city: getByTagName("PVCC"),
            }];
        }
    }],
    artists: {
        every: "PARAGRAFO[@etichetta='AUTHOR']/RIPETIZIONE",
        data: {
            name: ["AUTN", (name, getByTagName) => {
                const connection = getByTagName("AUTS");
                if (connection) {
                    return `${name}, ${connection}`;
                }
                return name;
            }],
            pseudonym: "AUTP",
        },
    },
    images: {
        every: "FOTO",
        data: (val) => val.replace(/^.*[/]/, ""),
    },
};

const searchByProps = function(root, propMap) {
    const results = {};

    const getByTagName = (name) => {
        const node = root.get(`.//${name}`);
        if (node) {
            return (node.value ?
                node.value() :
                node.text());
        }
    };

    if (typeof propMap === "function") {
        return propMap(root.text());
    }

    for (const propName in propMap) {
        let searchValue = propMap[propName];
        const hasFilter = Array.isArray(searchValue);

        if (hasFilter) {
            searchValue = searchValue[0];
        }

        if (typeof searchValue === "string") {
            if (searchValue === ".") {
                results[propName] = root.text();

            } else {
                results[propName] = getByTagName(searchValue);
            }

            if (hasFilter) {
                results[propName] =
                    propMap[propName][1](results[propName], getByTagName);
            }

        } else if (typeof searchValue === "object") {
            if (searchValue.every) {
                const matches = root.find(`.//${searchValue.every}`);
                results[propName] = matches.map(
                    (node) => searchByProps(node, searchValue.data));
            } else {
                results[propName] = searchByProps(root, searchValue);
            }
        }
    }

    return results;
};

module.exports = {
    files: [
        "An fzeri_OA_*.xml XML file.",
    ],

    processFiles(fileStreams, callback) {
        fileStreams[0].pipe(concat((fileData) => {
            try {
                const fileString = fileData.toString("utf8");
                const xmlDoc = libxmljs.parseXml(fileString, {
                    recover: true,
                });
                const matches = xmlDoc.find("//SCHEDA").map((node) => {
                    const match = searchByProps(node, propMap);
                    match.lang = "it";
                    return match;
                });
                callback(null, matches);
            } catch (e) {
                callback(e);
            }
        }));
    },
};
