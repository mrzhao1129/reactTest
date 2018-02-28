module.exports = function(env, ...a) {
  console.log(a);
  console.log(env);
  return require(`./webpack.${env}.js`)
}