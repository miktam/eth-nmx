pragma solidity ^0.4.24;

import "../crowdsale/emission/AllowanceCrowdsale.sol";
import "../crowdsale/price/IncreasingPriceCrowdsale.sol";


contract NmxToken is StandardToken {

  string public constant name = "Numex";
  string public constant symbol = "NMX";
  uint8 public constant decimals = 18;

  uint256 public constant INITIAL_SUPPLY = 1500000 * (10 ** uint256(decimals));

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
  }
}


/**
 * @title NmxCrowdsale
 * TimedCrowdsale - sets a time boundary for raising funds
 * AllowanceCrowdsale - allows to purchase tokens from external wallet
 */
contract NmxCrowdsale is AllowanceCrowdsale, IncreasingPriceCrowdsale {

  // solium-disable-next-line max-len
  event CrowdsaleCreated(address owner, uint256 openingTime, uint256 closingTime, uint256 rate);

  constructor(
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _rate,
    uint256 _ratePublic,
    address _wallet,
    StandardToken _token,
    address _tokenHolderWallet
  )
    public
    Crowdsale(_rate, _wallet, _token)
    AllowanceCrowdsale(_tokenHolderWallet)
    TimedCrowdsale(_openingTime, _closingTime)
    IncreasingPriceCrowdsale(_rate, _ratePublic)
  {
    emit CrowdsaleCreated(
      msg.sender, 
      _openingTime, 
      _closingTime, 
      _rate);
  }

  /**
  * There are only 2 rates: private and public - equally long
  */
  function getCurrentRate() public view returns (uint256) {
    // solium-disable-next-line security/no-block-members
    uint256 elapsedTime = block.timestamp.sub(openingTime);
    uint256 timeRange = closingTime.sub(openingTime);
    if (elapsedTime < timeRange.div(2)) {
      return initialRate;
    } else {
      return finalRate;
    }
  }
}
