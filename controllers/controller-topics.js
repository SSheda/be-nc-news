const { selectAllTopics } = require("../models/model-topics");

exports.getAllTopics = (req, res, next) => {
    
    selectAllTopics()
      .then((topics) => {
        res.status(200).send({ topics });
      })
      .catch(next);
  };