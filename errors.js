exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  else {
    next(err);
  }
}


exports.handleCustomerErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  else {
    next(err);
  }
}

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.handlePathNotFound = (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
};
