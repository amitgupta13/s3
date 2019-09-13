module.exports = validator => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      errorObj = {};
      error.details.forEach(
        err => (errorObj[err.context.key] = err.message.replace(/\"/g, ""))
      );
      return res.status(400).json(errorObj);
    }
    next();
  };
};
