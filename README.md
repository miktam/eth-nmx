# Eth-nmx
[![Build Status](https://img.shields.io/travis/miktamsol/eth-nmx.svg?branch=master&style=flat-square)](https://travis-ci.org/miktamsol/eth-nmx)
[![Coverage Status](https://img.shields.io/coveralls/github/miktamsol/eth-nmx/master.svg?style=flat-square)](https://coveralls.io/github/miktamsol/eth-nmx?branch=master)

## Crowdsale Contracts
Smart contract for crowdsale, based on OpenZeppelin libraries of community audited code. 

Assumptions are:
- price of token is based on ETHUSD price, taken from Coinbase in the time of contract deployment
- change in amount of tokens distributed is based on amount of contributed Ether in wei
- tokens are not locked from withdrawal until it ends

According to OZ, to build your own distributed applications, for security reasons we encourage you NOT to modify the framework’s base contracts, libraries, and interfaces. In order to leverage and extend their functionality, we encourage you to inherit from them or compose them together with your own contracts.

The Solidity programming language supports multiple inheritance. This is very powerful yet it can also be confusing: the more complexity you introduce to your distributed applications through multiple inheritance, the greater your application’s attack surface is.

## Variables to provide
- startTime (August 20th, 12am)
- closing time (in 12 weeks)
- wallet (ideally multisig)
- token address
- initial rate (at the time of deployment - eg Coinbase ETHUSD)
- final rate 

no need to provide:
- whitelist addresses
- refund (total soft, hard caps)
- individual caps

## Security
OpenZeppelin is meant to provide secure, tested and community-audited code, but please use common sense when doing anything that deals with real money! We take no responsibility for your implementation decisions and any security problem you might experience.

The core development principles and strategies that OpenZeppelin is based on include: security in depth, simple and modular code, clarity-driven naming conventions, comprehensive unit testing, pre-and-post-condition sanity checks, code consistency, and regular audits.
