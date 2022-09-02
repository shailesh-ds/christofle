const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  entry: {
    main: "./src/main.js",
    locator: "./src/locator.ts"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          // Order is last to first
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jpe?g)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /^.*?\bfonts\b.*?\bsvg\b.*?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /^.*?\bimages\b.*?\bsvg\b.*?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[ext]",
            },
          },
        ],
      }
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), "..."],
  },
  externals: {
    google: "google",
  },
};
