const { ether } = require('../helpers/ether');
const { advanceBlock } = require('../helpers/advanceToBlock');
const { increaseTimeTo, duration } = require('../helpers/increaseTime');
const { latestTime } = require('../helpers/latestTime');
const { expectThrow } = require('../helpers/expectThrow');
const { EVMRevert } = require('../helpers/EVMRevert');
const { assertRevert } = require('../helpers/assertRevert');
const { ethGetBalance } = require('../helpers/web3');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const NmxCrowdsale = artifacts.require('NmxCrowdsale');
const NmxToken = artifacts.require('NmxToken');

contract('NmxCrowdsale', function ([_, owner, walletToCollectEth, investor]) {
  const RATE = new BigNumber(10);
  const value = ether(0.42);
  const TOTAL_SUPPLY = 1500000 * (10 ** 18);

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
  });

  beforeEach(async function () {
    this.openingTime = (await latestTime()) + duration.weeks(1);
    this.closingTime = this.openingTime + duration.weeks(12);
    this.afterClosingTime = this.closingTime + duration.seconds(1);

    // owner deploys token
    this.token = await NmxToken.new({ from: owner });

    // owner deploys crowdsale contract
    this.crowdsale = await NmxCrowdsale.new(
      this.openingTime, this.closingTime, RATE, walletToCollectEth, this.token.address, owner,
      { from: owner }
    );

    // owner of the tokens approves crowdsale contract to spend
    await this.token.approve(this.crowdsale.address, TOTAL_SUPPLY, {from: owner});
  });

  it('should create crowdsale with correct parameters', async function () {
    this.crowdsale.should.exist;
    this.token.should.exist;

    const openingTime = await this.crowdsale.openingTime();
    const closingTime = await this.crowdsale.closingTime();
    const rate = await this.crowdsale.rate();
    const walletAddress = await this.crowdsale.wallet();
    const tokenWallet = await this.crowdsale.tokenWallet();

    openingTime.should.be.bignumber.equal(this.openingTime);
    closingTime.should.be.bignumber.equal(this.closingTime);
    rate.should.be.bignumber.equal(RATE);
    walletAddress.should.be.equal(walletToCollectEth);
    tokenWallet.should.be.equal(owner);
  });

  it('allowance and token supply should be equal before the crowdsale', async function () {
    const balance = await this.token.balanceOf(owner);
    const remainingTokens = await this.crowdsale.remainingTokens();
    remainingTokens.should.be.bignumber.equal(balance);
  });

  it('should not accept payments before start', async function () {
    await expectThrow(
      this.crowdsale.send(ether(1)),
      EVMRevert
    );
    await expectThrow(
      this.crowdsale.buyTokens(investor, { from: investor, value: ether(1) }),
      EVMRevert
    );
  });

  it('should accept payments during the sale', async function () {
    const investmentAmount = ether(1);
    const expectedTokenAmount = RATE.mul(investmentAmount);

    await increaseTimeTo(this.openingTime);
    await this.crowdsale.buyTokens(investor, { value: investmentAmount, from: investor });

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);

    const remainingTokens = await this.crowdsale.remainingTokens();
    remainingTokens.should.be.bignumber.equal(TOTAL_SUPPLY - expectedTokenAmount);

    const balanceOfTokensOwner = await this.token.balanceOf(owner);
    balanceOfTokensOwner.should.be.bignumber.equal(TOTAL_SUPPLY - expectedTokenAmount);
  });

  /**
   * TimedCrowdsale
   */
  it('should reject payments before start', async function () {
    await expectThrow(this.crowdsale.send(ether(1)), EVMRevert);
    await expectThrow(this.crowdsale.buyTokens(investor, { from: investor, value: value }), EVMRevert);
  });

  it('should accept payments after start', async function () {
    await increaseTimeTo(this.openingTime);
    await this.crowdsale.send(value);
    await this.crowdsale.buyTokens(investor, { value: ether(1), from: investor });
  });

  it('should reject payments after end', async function () {
    await increaseTimeTo(this.afterClosingTime);
    await expectThrow(this.crowdsale.send(value), EVMRevert);
    await expectThrow(this.crowdsale.buyTokens(investor, { value: ether(1), from: investor }), EVMRevert);
  });
});
