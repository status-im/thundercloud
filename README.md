This starter script lets you generate a running local Ethereum 1 simulation with a deployed Ethereum 2 deposit contract, a private key with a million ether to distribute, and an included faucet through which to distribute that ether. Optionally, you can pass in the number of accounts you want auto-deposited with 32 ether, so they immediately qualify as validators.

## Usage

### Prerequisites

You will have to pollute your system a little for this to work. Luckily, it works fine inside a VM too, and also NVM (see below) keeps things somewhat clean.

- Install NVM to have a working NodeJS setup. If you don't, nodeJS and npm will probably break in many, many ways. Once you have NVM, set it to Node version 10.
- Install the Yarn package manager: https://yarnpkg.com/lang/en/docs/install/
- Run `yarn install` to install dependencies

### Start

Change the mnemonic to your own in `.env.example` and rename `.env.example` to `.env`.

- Run `node start.js` with optional flags

The blockchain database will be stored in the `deploy/db` subfolder. The `deploy/keys` subfolder will have keys for relevant accounts generated, including the address to the deposit contract. The `deploy/faucet` folder will contain a simple web UI for a faucet.

#### Flags

Augment `start.js` with flags, .e.g. `node start.js v=50`:

- `v` : Number of validators to generate. These validators will be generated with 32.1 ether each and will auto-deposit 32 ether to the deposit contract. Their private keys will be in `deploy/keys` @TODO, `account_keys_path` in Ganache seems bugged.

### Hosting

To host the generated blockchain online, upload the `deploy` folder somewhere and `cd` into it.

- Run Ganache from the existing database with `yarn run ganache`. This auto-reads from `./db` and opens up web3/RPC so others can connect to your Ganache and try being validators.
- Run the faucet with `yarn run faucet --port 8080`. The faucet will be hosted on port 8080.
- @TODO Run the simple UI for validators to deposit Ether and check their balance with `yarn run validator-ui`.

### Other commands

- To clean the DB and start over delete `deploy/db/*` or run `yarn run clean`.

## Contributing

Please consider contributing PRs, we'd love the help!

## License

Licensed and distributed under either of

* MIT license: [LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT

or

* Apache License, Version 2.0, ([LICENSE-APACHEv2](LICENSE-APACHEv2) or http://www.apache.org/licenses/LICENSE-2.0)

at your option. These files may not be copied, modified, or distributed except according to those terms.
