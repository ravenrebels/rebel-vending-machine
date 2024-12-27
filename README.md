# Rebel Vending Machine
<img src="https://github.com/user-attachments/assets/6657cb96-a69b-42f2-b0c9-9a9b9a96e9b4" alt="Rebel Vending Machine Logo" width="400">



This repository contains a Node.js-based service for selling assets on the Ravencoin and Evrmore blockchains. The service automates the process of monitoring payments and sending tokens in exchange for received payments. You only interact with buyers/customers on the chain. There is no graphical user interface for the end user.

Explaining how to use this service and teaching everything you need to know to get it running is HARDER than writing the code ;)

## SHORT Explanation of How It Works

So you want to sell LEMONADE tokens for the price of 10 RVN.  
You install/setup this service and configure "jobs" in a new file called jobs.json that **you** create.  
In that file, you define that you want to sell LEMONADE tokens, 1 at a time for the price of 10 RVN.  
**And**, this is important, you need two wallets (as 12-word mnemonic keys):

### `externalWallet`

This is the end-user-facing wallet. It is the wallet that end users will pay to.  
This is also the wallet that will hold the LEMONADE tokens that you want to sell.  
When you start the service, it will print out an address for this wallet.  
So make sure you fill it up with lovely LEMONADE tokens.

### `internalWallet`

This is where the funds are deposited. After each purchase, the remaining funds will end up here.

## How Does It Work Technically?

- Payment Monitoring: Automatically monitors incoming payments (UTXOs) to a specified wallet.
- Token Sending: Sends tokens back to the payer upon receiving a valid payment.
- Customizable Jobs: Configure asset sales with specific amounts, prices, and wallets.
- Error Handling: Graceful error management to ensure reliability.
- UTXO Tracking: Prevents double-spending or reprocessing of UTXOs by tracking already processed transactions.

## Prerequisites

- You need to have Git installed.
- You need to have Node.js installed.

## Getting Started

1. Clone the Git repository:  
   git clone https://github.com/ravenrebels/rebel-vending-machine.git

2. Install dependencies:

   - Change directory: cd rebel-vending-machine
   - Install dependencies: npm install

3. Configure the service:  
   Create a file called jobs.json in the current directory with the following content:

```
[
   {
      "amount": 1,
      "assetName": "DRUNK",
      "price": 10,
      "externalWallet": "<12-word mnemonic>",
      "internalWallet": "<12-word mnemonic>",
      "network": "rvn"
   }
]
```

This configuration specifies that upon receiving 10 RVN on the Ravencoin network, the service will send 1 "DRUNK" asset to the payer.  
You need to modify the content according to your requirements.  
You must generate two wallets, for example, using https://ravencoin.org/bip44/.  
Remember, a wallet is just a 12-word mnemonic.

## Advanced Configuration

- Ravencoin testnet is supported; use "network": "rvn-test".
- Evrmore mainnet is supported; use "network": "evr".

## Usage

1. Start the service:  
   Run the command: npm start  
   The service will display its external address.  
   Send the assets you want to sell to this address.  
   Example output: External address mp6V9b8Kpufq1WLan6Xe5pfa1S1dzt5zaX

2. The service will continuously monitor incoming payments and process jobs as defined in jobs.json.

3. Logs will provide information about:
   - Incoming payments
   - Sent tokens
   - Skipped or failed transactions

## Security Considerations

- Wallet Mnemonics: Store your wallet mnemonics securely and do not share them publicly.
- Local Access: If you expand this service with a web GUI or API, ensure it only accepts requests from localhost or implement robust authentication to enhance security.

## Contribution

Contributions are welcome! Feel free to fork this repository and submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

If you encounter any issues or have questions, feel free to open an issue in this repository.

For more information and support, visit the Raven Rebels GitHub repository:  
https://github.com/ravenrebels

For a visual demonstration of the Rebel Vending Machine in action, you can watch the following video:  
[Rebel Vending Machine Demonstration: https://www.youtube.com/watch?v=cNyhnypl0Kk](https://youtu.be/eCeMN5yx11U)
