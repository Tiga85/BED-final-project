

 const notFoundErrorHandler = (err, req, res, next) => {
    // Check if the error is a NotFoundError
    if (err.name === 'NotFoundError') {
      return res.status(404).json({ error: err.message });
    }
  
    // If it's not a NotFoundError, pass the error to the next middleware
    next(err);
  };
  
  export default notFoundErrorHandler;