import Wallet from "@ravenrebels/ravencoin-jswallet";
import fs from "fs";

handleErrorsGracefully();
validateConfiguration();

const jobs = JSON.parse(fs.readFileSync("./jobs.json", "utf-8"));

// Graceful shutdown mechanism
let running = true;
process.on("SIGINT", () => {
  running = false;
  console.log("Shutting down gracefully...");
});

const skippedUTXOs = new Set(); // Set to track skipped UTXOs by unique ID

(async function main() {
  while (running) {
    for (let job of jobs) {
      try {
        await work(job);
      } catch (e) {
        console.error("Error processing job:", e);
      }
    }
    await sleep(30 * 1000);
  }
})();

async function work(job) {
  const externalWallet = await Wallet.createInstance({
    network: job.network,
    mnemonic: job.externalWallet,
  });

  const externalAddressObject = externalWallet.getAddressObjects()[0];
  console.log("Job", job.assetName);
  console.log("External address", externalAddressObject.address);

  const assets = await externalWallet.getAssets();
  assets.forEach((a) => {
    a.balance /= 1e8;
    delete a.received;
  });
  console.table(assets);
  console.info("Price", job.price);
  console.log(); //blanks space

  try {
    const u1 = await externalWallet.getUTXOsInMempool();
    const u2 = await externalWallet.getUTXOs();
    const utxos = u1.concat(u2);

    if (utxos.length === 0) {
      console.debug("No UTXOs found");
      return;
    }

    const internalWallet = await Wallet.createInstance({
      network: job.network,
      mnemonic: job.internalWallet,
    });

    for (let utxo of utxos) {
      const utxoKey = `${utxo.txid}:${utxo.vout}`; // Unique key for UTXO

      if (skippedUTXOs.has(utxoKey)) {
        continue;
      }

      if (utxo.assetName !== externalWallet.baseCurrency) {
        console.debug(
          `Skipping UTXO (${utxoKey}): Not base currency (${utxo.assetName})`
        );
        skippedUTXOs.add(utxoKey);
        continue;
      }

      if (utxo.satoshis / 1e8 !== job.price) {
        console.debug(
          `Skipping UTXO (${utxoKey}): Price mismatch. Expected: ${
            job.price
          }, Found: ${utxo.satoshis / 1e8}`
        );
        skippedUTXOs.add(utxoKey);
        continue;
      }

      if (
        externalWallet.isSpentInMempool(utxo) ||
        internalWallet.isSpentInMempool(utxo)
      ) {
        console.debug(`Skipping UTXO (${utxoKey}): Already spent in mempool`);
        skippedUTXOs.add(utxoKey);
        continue;
      }

      const forcedUTXOs = [
        {
          utxo,
          address: utxo.address,
          privateKey: externalAddressObject.WIF,
        },
      ];

      const sender = await getSender(externalWallet, utxo);
      const options = {
        amount: job.amount,
        assetName: job.assetName,
        forcedUTXOs,
        forcedChangeAddressAssets: externalWallet.getAddresses()[0],
        forcedChangeAddressBaseCurrency: internalWallet.getAddresses()[0],
        toAddress: sender,
      };

      try {
        await externalWallet.send(options);
        console.log(`Asset ${job.assetName} sent successfully to ${sender}`);
      } catch (sendError) {
        console.error(`Failed to send asset for UTXO (${utxoKey}):`, sendError);
        skippedUTXOs.add(utxoKey); // Add to skipped list to prevent retrying
      }
    }
  } catch (e) {
    console.error("Error during payment processing:", e);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getSender(wallet, utxo) {
  const id = utxo.txid;
  const transaction = await wallet.rpc("getrawtransaction", [id, true]);
  for (let vin of transaction.vin) {
    if (vin.address) {
      return vin.address;
    }
  }
  return "Unknown Sender";
}

function handleErrorsGracefully() {
  if (process) {
    process.on("uncaughtException", (error, origin) => {
      console.log("----- Uncaught exception -----");
      console.error(error);
      console.log("----- Exception origin -----");
      console.error(origin);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.log("----- Unhandled Rejection at -----");
      console.error(promise);
      console.error("----- Reason -----");
      console.error(reason);
    });
  }
}

function validateConfiguration() {
  const example = [
    {
      amount: 1,
      assetName: "DRUNK",
      price: 10,
      externalWallet: "12 words 12 words 12 words",
      internalWallet: "12 words 12 words 12 words",
      network: "rvn",
    },
  ];

  if (!fs.existsSync("./jobs.json")) {
    console.error("Configuration file jobs.json not found");
    console.log("Please create the file job.json");
    console.log("Add your jobs");
    console.log("Example configuration:");
    console.log(JSON.stringify(example, null, 2));
    process.exit(1);
  }
}
