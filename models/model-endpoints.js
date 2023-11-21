const db = require("../db/connection");
const fs = require("fs/promises")

exports.selectAllEndpoints = () => {

    return fs.readFile(`./endpoints.json`)
        .then((data) => {
            const endpoints = JSON.parse(data);

            return endpoints;
        });
};