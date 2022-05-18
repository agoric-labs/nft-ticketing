# Agoric Ticketing App

The Ticketing Store Dapp is a Marketplace place for nfts which in this case are Tickets.

There are three main views in the Ticket Store dapp:

1. `Marketplace` : Users can buy the tickets on sale.
2. `Check In` : Here the user can check with the tickets they have and using them would burn tickets.
3. `Create Ticket` : Any user can create events and sell tickets for that.

Install the
[prerequisites](https://agoric.com/documentation/getting-started/before-using-agoric.html).

Then in a first terminal in the directory where you want to put your dapp, install the dapp:

```sh
agoric init --dapp-template dapp-ticket-store my-ticket-store
cd my-ticket-store
agoric install
# If the Agoric platform has not been started
agoric start --reset --verbose
```

In a second terminal, enter `agoric open` in a terminal window to open a wallet.

```sh
# Make sure to connect your dapp to your wallet before running this command.
agoric deploy contract/deploy.js api/deploy.js
```

In a third terminal,

```sh
# Navigate to the `ui` directory and start a local server
cd ui && yarn start
```

To learn more about how to build Agoric Dapps, please see the [Dapp Guide](https://agoric.com/documentation/dapps/).

To See the [Dapp Multi User Guide](https://agoric.com/documentation/guides/agoric-cli/starting-multiuser-dapps.html#example) for how to deploy this Dapp on a testnet and experience this dapp with multi user.
