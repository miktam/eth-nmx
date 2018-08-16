pragma solidity ^0.4.24;

import "../crowdsale/emission/AllowanceCrowdsale.sol";
import "../crowdsale/validation/TimedCrowdsale.sol";


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
 * @dev This is an example of a fully fledged crowdsale.
 * The way to add new features to a base crowdsale is by multiple inheritance.
 * In this example we are providing following extensions:
 * CappedCrowdsale - sets a max boundary for raised funds
 */
// solium-disable-next-line max-len
contract NmxCrowdsale is AllowanceCrowdsale, TimedCrowdsale {

  event CrowdsaleCreated(address owner, uint256 openingTime, uint256 closingTime, uint256 rate);

  constructor(
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _rate,
    address _wallet,
    StandardToken _token,
    address _tokenHolderWallet
  )
    public
    Crowdsale(_rate, _wallet, _token)
    AllowanceCrowdsale(_tokenHolderWallet)
    TimedCrowdsale(_openingTime, _closingTime)
  {
    emit CrowdsaleCreated(msg.sender, _openingTime, _closingTime, _rate);
  }
}
