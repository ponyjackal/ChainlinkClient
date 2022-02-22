// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

contract PriceFeed is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  uint256 constant private ORACLE_PAYMENT = 0.1 * 10 ** 18;
  
  struct Request {
    uint256 timestamp;
    bytes4 currencyKey;
  }

  address private owner;
  bytes32 public oracleJobId;
  
  mapping(bytes32 => Request) private requests;
  mapping(bytes4 => uint) public rates;

  uint256 constant ORACLE_PRECISION = 1000000000000000000;

  event RequestPriceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed price
  );

  constructor(address _link, address _oracle, string memory _jobId) {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
    owner = msg.sender;
    oracleJobId = stringToBytes32(_jobId);
  }

  function requestPrice(bytes4 currencyKey, string memory asset)
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(oracleJobId, address(this), this.fulfill.selector);
    string memory requestURL = string(abi.encodePacked("https://api.coingecko.com/api/v3/simple/price?ids=", asset, "&vs_currencies=usd"));
    req.add("get", requestURL);

    string memory path = string(abi.encodePacked(asset, ".usd"));
    req.add("path", path);
    
    req.addInt("times", int256(ORACLE_PRECISION));

    requests[sendChainlinkRequest(req, ORACLE_PAYMENT)] = Request(block.timestamp, currencyKey);
  }

  function fulfill(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    emit RequestPriceFulfilled(_requestId, _price);
   
    bytes4 currencyKey = requests[_requestId].currencyKey;
    uint timestamp = requests[_requestId].timestamp;
    rates[currencyKey] = _price;
  }

  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }

  function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
    uint8 i = 0;
    while(i < 32 && _bytes32[i] != 0) {
      i++;
    }
    bytes memory bytesArray = new bytes(i);
    for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
      bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
  }
    
  modifier onlyOwner() {
    require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }
}