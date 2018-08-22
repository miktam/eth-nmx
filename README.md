# Eth-nmx
[![Build Status](https://img.shields.io/travis/miktam/eth-nmx.svg?branch=master&style=flat-square)](https://travis-ci.org/miktam/eth-nmx)
[![Coverage Status](https://img.shields.io/coveralls/github/miktam/eth-nmx/master.svg?style=flat-square)](https://coveralls.io/github/miktam/eth-nmx?branch=master)

## Crowdsale Contracts
Smart contract for crowdsale, fulfilling following requrements:

1) there are 2 stages, 6 weeks each
2) token is deployed separately, full amount of tokens will be sold
3) price per token: 0.5USD in first stage, 1USD in second stage

## Variables to provide
- startTime (August 20th, 12am)   - in [Unix epoch time](https://www.epochconverter.com/)
- closing time (in 12 weeks)      - in Unix epoch time
- wallet to store collected ETH
- token address                   - ERC20 token address
- initial rate                    - amount of tokens per 1 Ether in first phase
- final rate                      - amount of tokens per 1 Ether in second phase

## Security
Crowdsale contract is heavily influenced by [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity/) community audited smart contracts

