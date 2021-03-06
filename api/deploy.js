// @ts-check
/* global process */

// Agoric Dapp api deployment script
import fs from 'fs';
import { E } from '@agoric/eventual-send';
import '@agoric/zoe/exported.js';
import { Far } from '@endo/marshal';
import installationConstants from '../ui/src/conf/installationConstants.js';
import { tickets } from './tickets.js';

// deploy.js runs in an ephemeral Node.js outside of swingset. The
// spawner runs within ag-solo, so is persistent.  Once the deploy.js
// script ends, connections to any of its objects are severed.

/**
 * @typedef {Object} DeployPowers The special powers that `agoric deploy` gives us
 * @property {(path: string) => Promise<{ moduleFormat: string, source: string }>} bundleSource
 * @property {(path: string) => string} pathResolve
 * @property {(path: string, opts?: any) => Promise<any>} installUnsafePlugin
 *
 * @typedef {Object} Board
 * @property {(id: string) => any} getValue
 * @property {(value: any) => string} getId
 * @property {(value: any) => boolean} has
 * @property {() => [string]} ids
 */

const API_PORT = process.env.API_PORT || '8000';

/**
 * @typedef {{ zoe: ZoeService, board: Board, spawner, wallet,
 * uploads, http, agoricNames, chainTimerService }} Home
 * @param {Promise<Home>} homePromise
 * A promise for the references available from REPL home
 * @param {DeployPowers} powers
 */
export default async function deployApi(homePromise, { pathResolve }) {
  // Let's wait for the promise to resolve.
  const home = await homePromise;

  // Unpack the references.
  const {
    // *** ON-CHAIN REFERENCES ***
    // Zoe lives on-chain and is shared by everyone who has access to
    // the chain. In this demo, that's just you, but on our testnet,
    // everyone has access to the same Zoe.
    zoe,
    // The board is an on-chain object that is used to make private
    // on-chain objects public to everyone else on-chain. These
    // objects get assigned a unique string id. Given the id, other
    // people can access the object through the board. Ids and values
    // have a one-to-one bidirectional mapping. If a value is added a
    // second time, the original id is just returned.
    board,
    wallet,
  } = home;

  // To get the backend of our dapp up and running, first we need to
  // grab the installation that our contract deploy script put
  // in the public board.

  // CMT (hussain.rizvi@robor.systems): These constants contain the board ids of the installation of all the contracts in card-store-dapp.
  const { MARKET_PLACE_INSTALLATION_BOARD_ID, CONTRACT_NAME } =
    installationConstants;

  // CMT (hussain.rizvi@robor.systems): Fetching the installation of the contract.js from the board.
  const marketPlaceInstallation = await E(board).getValue(
    MARKET_PLACE_INSTALLATION_BOARD_ID,
  );

  // Second, we can use the installation to create a new instance of
  // our contract code on Zoe. A contract instance is a running
  // program that can take offers through Zoe. Making an instance will
  // give us a `creatorFacet` that will let us make invitations we can
  // send to users.

  /**
   * @type {ERef<Issuer>}
   */

  // CMT (hussain.rizvi@robor.systems): Fetching the promise of issuer of RUN currency from the board
  const moneyIssuerP = E(home.agoricNames).lookup('issuer', 'RUN');
  // CMT (hussain.rizvi@robor.systems): Fetching the promise of brand of RUN currency from the board.
  const moneyBrandP = E(moneyIssuerP).getBrand();

  // CMT (hussain.rizvi@robor.systems): Resolving the promises to obtain issuer, brand and display info of RUN currency.
  const [moneyIssuer, moneyBrand, { decimalPlaces = 0 }] = await Promise.all([
    moneyIssuerP,
    moneyBrandP,
    E(moneyBrandP).getDisplayInfo(),
  ]);
  // const allTickets = { tickets: harden(tickets) };
  const allTickets = { tickets };
  console.log('- SUCCESS! contract instance is running on Zoe');
  console.log('Retrieving Board IDs for issuers and brands');
  const {
    creatorInvitation,
    creatorFacet: marketPlaceCreatorFacet,
    publicFacet: marketPlaceFacet,
    instance: marketPlaceInstance,
  } = await E(zoe).startInstance(
    marketPlaceInstallation,
    harden({ Price: moneyIssuer }),
    allTickets,
  );
  // await E(marketPlaceCreatorFacet).setIsSeller();
  // console.log('instance done');
  const { cardBrand, cardIssuer } = await E(marketPlaceFacet).getItemsIssuer();
  // CMT (hussain.rizvi@robor.systems): Storing each important variable on the board and getting their board ids.
  // CMT (hussain.rizvi@robor.systems): Fetching promise of the global issuer for invitations.
  const invitationIssuerP = E(zoe).getInvitationIssuer();
  // CMT (hussain.rizvi@robor.systems): Fetching promise of invitation brand using invitation issuer.
  const invitationBrand = await E(invitationIssuerP).getBrand();

  const [
    MONEY_BRAND_BOARD_ID,
    MONEY_ISSUER_BOARD_ID,
    CARD_BRAND_BOARD_ID,
    CARD_ISSUER_BOARD_ID,
    INVITE_BRAND_BOARD_ID,
    MARKET_PLACE_INSTANCE_BOARD_ID,
    MARKET_PLACE_FACET_BOARD_ID,
  ] = await Promise.all([
    E(board).getId(moneyBrand),
    E(board).getId(moneyIssuer),
    E(board).getId(cardBrand),
    E(board).getId(cardIssuer),
    E(board).getId(invitationBrand),
    E(board).getId(marketPlaceInstance),
    E(board).getId(marketPlaceFacet),
  ]);

  const walletP = await E(wallet).getBridge();
  const depositFacetId = await E(walletP).getDepositFacetId(
    INVITE_BRAND_BOARD_ID,
  );
  // Depositing creator Invitation to contract deployer's wallet.
  const depositFacet = await E(board).getValue(depositFacetId);
  console.log('creatorInvitation', creatorInvitation);
  const sellerInvitation = await E(marketPlaceCreatorFacet).makeInvitation();
  await E(depositFacet).receive(creatorInvitation);
  await E(depositFacet).receive(sellerInvitation);
  // const invitation = await E(marketPlaceCreatorFacet).makeInvitation();
  // await E(depositFacet).receive(invitation);

  console.log(`-- Contract Name: ${CONTRACT_NAME}`);
  console.log(
    `-- MARKET_PLACE_INSTANCE_BOARD_ID: ${MARKET_PLACE_INSTANCE_BOARD_ID}`,
  );

  console.log(`-- MARKET_PLACE_FACET_BOARD_ID: ${MARKET_PLACE_FACET_BOARD_ID}`);
  const API_URL = process.env.API_URL || `http://127.0.0.1:${API_PORT || 8000}`;

  // Re-save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    BRIDGE_URL: 'agoric-lookup:https://local.agoric.com?append=/bridge',
    brandBoardIds: {
      Money: MONEY_BRAND_BOARD_ID,
      Card: CARD_BRAND_BOARD_ID,
    },
    issuerBoardIds: {
      Money: MONEY_ISSUER_BOARD_ID,
      Card: CARD_ISSUER_BOARD_ID,
    },
    API_URL,
    CONTRACT_NAME,
    INVITE_BRAND_BOARD_ID,
    MARKET_PLACE_INSTANCE_BOARD_ID,
    MARKET_PLACE_INSTALLATION_BOARD_ID,
    MARKET_PLACE_FACET_BOARD_ID,
  };
  const defaultsFile = pathResolve(`../ui/src/conf/defaults.js`);
  console.log('writing', defaultsFile);
  const defaultsContents = `\
// GENERATED FROM ${pathResolve('./deploy.js')}
export default ${JSON.stringify(dappConstants, undefined, 2)};
`;
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}
