const db = require("../db/connection")

exports.selectAllTopics = (req, res, next) => {
   
    return db.query(`SELECT * FROM topics`)
    .then((result) => {
      return result.rows;
    });
  };