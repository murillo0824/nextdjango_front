const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


const endPoint = "https://nextjs-api-murillo.herokuapp.com/"

app.prepare().then(() => {
  const server = express();

  
  server.use(
    "/api",
    createProxyMiddleware({
      target:`${endPoint}`,
      changeOrigin: true
    })
  );
  // server.use(
  //   "/user",
  //   createProxyMiddleware({
  //     target:`https://nextjs-api-murillo.herokuapp.com/api/register/`,
  //     changeOrigin: true
  //   })
  // );

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

