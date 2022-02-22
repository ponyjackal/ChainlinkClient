// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = require("ethers");
require("dotenv").config();
const {
  CHAINLINK,
} = require("../config");

const network = process.env.NETWORK;

async function main() {
  try {
    await hre.run("verify:verify", {
      address: "0xbdC05929cD5A7c41256994353Ba762a2B3B4f534",
      constructorArguments: [
        CHAINLINK[network].linkToken,
        CHAINLINK[network].oracle,
        CHAINLINK[network].jobId
      ],
    });
  } catch (err) {
    console.log(err);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
