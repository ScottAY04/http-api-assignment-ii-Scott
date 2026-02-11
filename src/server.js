const http = require('http');
const htmlHandler = require("./htmlResponses.js");
const responseHandler = require("./responses.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//full url struct for different endpoints
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS, 
  '/getUsers': responseHandler.getUsers,
  '/addUser': responseHandler.addUser,
  notFound: responseHandler.notFound,
};

//handle requests
const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (urlStruct[parsedUrl.pathname]) {
    return urlStruct[parsedUrl.pathname](request, response);
  }
  return urlStruct.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});