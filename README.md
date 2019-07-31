This starter script lets you generate a running local Ethereum 1 simulation with a deployed Ethereum 2 deposit contract, a private key with a million ether to distribute, and an included faucet through which to distribute that ether. Optionally, you can pass in the number of accounts you want auto-deposited with 32 ether, so they immediately qualify as validators.

## Usage

### Prerequisites

You will have to pollute your system a little for this to work. Luckily, it works fine inside a VM too, and also NVM (see below) keeps things somewhat clean.

- Install NVM to have a working NodeJS setup. If you don't, nodeJS and npm will probably break in many, many ways. Once you have NVM, set it to Node version 10.
- Install the Yarn package manager: https://yarnpkg.com/lang/en/docs/install/
- Run `yarn install && cd deploy/faucet && yarn install` to install dependencies

### Start

1. Clone repo and modify the mnemonic in the `.env` file.
2. If you want to add some pre-created private keys, add them to the `.mykeys` file.
3. Run `node start.js`. Optionally, pass in a `v` argument to autogenerate that many validators (`v=10`) and/or the `mykeys` argument to make the script read the keys specified in step 2.

The blockchain database will be stored in the `deploy/db` subfolder. The `deploy/keys` subfolder will have keys for relevant accounts generated, including the address to the deposit contract. The `deploy/faucet` folder will contain a simple web UI for a faucet. See hosting below for how to run it.

#### Flags

Augment `start.js` with flags, .e.g. `node start.js v=50 mykeys`:

- `v` : Number of validators to generate. These validators will be generated with 32.1 ether each and will auto-deposit 32 ether to the deposit contract. Their private keys will be in `deploy/keys`. Defaults to 10 if omitted, but only triggers default is `mykeys` argument not provided.
- `mykeys`: This is a boolean flag, so just include it to activate it. Passing this in will make the boostrapper read a `.mykeys.json` file in the root of the project, looking for private keys. The file should be a JSON object of (address => privkey) pairs, `0x` included. These keys will then also be included as validators: they will be given 32.1 ether and deposit it into the contract. See `.mykeys.example` for example.

### Hosting

The generator is deterministic. You always end up with the same addresses, accounts and balances if you use the same mnemonic and `.mykeys` list. Thus, to host it somewhere, simply clone this repo to the server and run it the same way you do locally.

- `node start.js` will run the blockchain and start the server in listen mode with RPC/Web3 allowed
- `yarn faucet` will host the ether faucet at `localhost:5000`
- @TODO `yarn validator-ui` will host the validator UI at `localhost:8081`

### Other commands

- To clean the DB and start over run `yarn run clean`.

## Contributing

Please consider contributing PRs, we'd love the help! There's only one condition: please try to keep the dependencies to a minimum of minimums, and do NOT use something that needs [node-gyp](https://github.com/nodejs/node-gyp/issues/809).

## License

Licensed and distributed under either of

* MIT license: [LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT

or

* Apache License, Version 2.0, ([LICENSE-APACHEv2](LICENSE-APACHEv2) or http://www.apache.org/licenses/LICENSE-2.0)

at your option. These files may not be copied, modified, or distributed except according to those terms.
