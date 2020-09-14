function NotFoundException(message) {
  this.message = message;
  this.name = "NotFoundException";
}

module.exports = {
  NotFoundException: NotFoundException,
};
