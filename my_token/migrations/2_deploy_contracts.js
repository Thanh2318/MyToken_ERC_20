const Mytoken = artifacts.require("Mytoken");

module.exports = function (deployer) {
  deployer.deploy(Mytoken,1000000000);
};
