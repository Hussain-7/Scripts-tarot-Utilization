// create a basic server
var http = require("http");
const { fetchInfoFromPage, sendEmail } = require("./main");
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});
const utilizationNotify = async () => {
  fetchInfoFromPage().then((data) => {
    if (data.value !== 100) sendEmail(data.utilization);
  });
};

// start the server
server.listen(3000, function () {
  console.log("Server listening on port 3000");
  // every 10minutes
  utilizationNotify();
  setInterval(() => {
    utilizationNotify();
  }, 60000 * 10);
});
