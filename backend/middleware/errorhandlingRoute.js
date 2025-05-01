const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    console.log(err);
    res.status(500).json({ message: err.message || "Server Error" });
  };

  const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Resource not found",
    });
};

  module.exports = { errorHandler , notFoundHandler };


