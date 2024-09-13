class NotFoundError extends Error {
  constructor(resourceType, id) {
    super(`${resourceType} with id ${id} was not found!`); // Custom message
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
