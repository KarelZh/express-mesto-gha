const http2 = require('node:http2');

const ERROR_400 = http2.constants.HTTP_STATUS_BAD_REQUEST;
const ERROR_404 = http2.constants.HTTP_STATUS_NOT_FOUND;
const ERROR_500 = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

module.exports = {
  ERROR_400,
  ERROR_404,
  ERROR_500,
};
