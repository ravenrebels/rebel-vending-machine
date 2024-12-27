Rebel Vending Machine

This repository contains a Node.js-based service for selling assets on the Ravencoin and Evrmore blockchains. The service automates the process of monitoring payments and sending tokens in exchange for received payments. You only interact with buyers/customers on the chain. There is no graphical user interface for the end user.

Sir, how does it work technically?

- Payment Monitoring: Automatically monitors incoming payments (UTXOs) to a specified wallet.
- Token Sending: Sends tokens back to the payer upon receiving a valid payment.
- Customizable Jobs: Configure asset sales with specific amounts, prices, and wallets.
- Error Handling: Graceful error management to ensure reliability.
- UTXO Tracking: Prevents double-spending or reprocessing of UTXOs by tracking already processed transactions.

Prerequisites

- You need to have git installed.
- You need to have Node.js installed.

Getting Started

1. Clone the git repository:
   git clone https://github.com/ravenrebels/vending-machine.git

2. Install dependencies:
   Change directory: cd rebel-vending-machine
   Install dependencies: npm install

3. Configure the service:
   Create a file called jobs.json in the current directory with the following content:

```JSON
   [
      {
         "amount": 1,
         "assetName": "DRUNK",
         "price": 10,
         "externalWallet": "12 words 12 words 12 words",
         "internalWallet": "12 words 12 words 12 words",
         "network": "rvn"
      }
   ]
```

This configuration specifies that upon receiving 10 RVN on the Ravencoin network, the service will send 1 "DRUNK" asset to the payer.

You an use https://ravencoin.org/bip44/ to create wallets / mnemonic keys / 12 words
Advanced Configuration

- Ravencoin testnet is supported; use "network": "rvn-test".
- Evrmore mainnet is supported; use "network": "evr".

Usage

1. Start the service:
   Run the command: `npm start`
   The service will display its external address.
   Send the assets you want to sell to this address.
   Example output: `External address mp6V9b8Kpufq1WLan6Xe5pfa1S1dzt5zaX`

2. The service will continuously monitor incoming payments and process jobs as defined in jobs.json.

3. Logs will provide information about:
   - Incoming payments
   - Sent tokens
   - Skipped or failed transactions

Security Considerations

- Wallet Mnemonics: Store your wallet mnemonics securely and do not share them publicly.
- Local Access: If you expand this service with a web GUI or API, ensure it only accepts requests from localhost to enhance security.

Contribution

Contributions are welcome! Feel free to fork this repository and submit pull requests for improvements or bug fixes.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Support

If you encounter any issues or have questions, feel free to open an issue in this repository.

For more information and support, visit the Raven Rebels GitHub page: https://github.com/ravenrebels

For a visual demonstration of the Rebel Vending Machine in action, you can watch the following video:
Rebel Vending Machine Demonstration: https://www.youtube.com/watch?v=cNyhnypl0Kk
