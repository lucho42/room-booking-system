const ioClient = io({
  reconnection: false,
});

ioClient.on("connect", () => {
  console.log("client websocket connection ok !");
});
