const CHAINLINK = {
  bsctest: {
    linkToken: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
    oracle: "0x670168E4C426A90f82745f86Cc91687250E09125",
    jobId: "60803b12c6de4443a99a6078aa59ef70", // Get Uint256 JobID for Binance Smart Chain Testnet
  },
  kovan: {
    linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
    oracle: "0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8",
    jobId: "d5270d1c311941d0b08bead21fea7747", // Get Uint256 JobID for Kovan
  },
  localhost: {
    linkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    oracle: "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e",
    jobId: "2e37b8362f474fce9dd019fa195a8627", // CMC JobID for Binance Smart Chain Testnet
  },
};

module.exports = {
  CHAINLINK
};
