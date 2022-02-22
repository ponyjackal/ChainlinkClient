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

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  console.log(
    ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("DVDX"), 0, 4),
    ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("dBTC"), 0, 4),
    ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("dETH"), 0, 4)
  );

  console.log("oracle Job Id", ethers.utils.hexZeroPad(CHAINLINK['kovan'].jobId, 32))

  const PriceFeed = await hre.ethers.getContractFactory("PriceFeed");
  const priceFeed = await PriceFeed.attach(
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  );

  await priceFeed.test("d5270d1c311941d0b08bead21fea7747", "d5270d1c311941d0b08bead21fea7747");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
