const db = require("../db/connection");
const fs = require("fs/promises")

exports.selectAllEndpoints = () => {

    return fs.readFile(`./endpoints.json`)
        .then((data) => {
            const endpoints = JSON.parse(data);

            if (endpoints.hasOwnProperty("GET /api")) {
                delete endpoints["GET /api"]
            }
            return endpoints;
        });
};