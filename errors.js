exports.errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', { error: err })
  }
  
  exports.handleNotFound = (req, res) => {
    res.status(404).send({ msg: 'Path not found' });
  };  