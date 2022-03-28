const webpack = require("webpack")
const devMiddleware = require("webpack-dev-middleware")
const express = require("express")
const fs = require("fs")
const config = require("./webpack.config.js")

const app = express()

app.use(
  devMiddleware(webpack(config), {
    publicPath: config.output.publicPath,
  })
)

app.use(express.static("dist"))

app.use("/glsl", express.static("glsl"))

app.listen(3000)
