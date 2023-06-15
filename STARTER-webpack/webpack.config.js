const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    /* watchOptions: permet à Webpack de surveiller les fichiers de l'application pour détecter 
    les modifications et de recompiler automatiquement le code 
    lorsque des changements sont détectés. 
    La propriété poll est définie sur true, 
    ce qui signifie que Webpack utilisera la méthode de sondage pour surveiller 
    les fichiers au lieu d'utiliser les événements du système de fichiers. 
    Cela peut être utile si vous travaillez avec un système de fichiers monté à distance, 
    car les événements du système de fichiers ne fonctionnent pas toujours correctement dans ce cas. */
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Javascript Objet avec Webpack',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js']
  },
};