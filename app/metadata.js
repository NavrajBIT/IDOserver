import {
  Collection,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionDataArgs,
  Creator,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  UpdateMetadataAccountV2InstructionAccounts,
  UpdateMetadataAccountV2InstructionData,
  Uses,
  createMetadataAccountV3,
  updateMetadataAccountV2,
  findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import * as web3 from "@solana/web3.js";
import {
  PublicKey,
  createSignerFromKeypair,
  none,
  signerIdentity,
  some,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import base58 from "bs58";

async function metadata() {
  console.log("Adding metadata...");
  const payerPrivateKey = "";
  const payerPrivateKeydecoded = base58.decode(payerPrivateKey);
  const myKeypair = web3.Keypair.fromSecretKey(payerPrivateKeydecoded);
  const mint = new web3.PublicKey(
    "GCB6UqJUmf1poDdoLA4CKxuQ5vnmenrUtrikyrSfccco"
  );

  const umi = createUmi("https://api.testnet.solana.com");
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
  umi.use(signerIdentity(signer, true));
  console.log("1-----------------------");

  const ourMetadata = {
    name: "BitBhoomi",
    symbol: "Bhoomi",
    uri: "https://nftree.s3.ap-south-1.amazonaws.com/static/metadata.json",
  };

  const onChainData = {
    ...ourMetadata,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  console.log("2-----------------------");

  const data = {
    data: some(onChainData),
    discriminator: 0,
    isMutable: some(true),
    newUpdateAuthority: null,
    primarySaleHappened: null,
  };
  const accounts = {
    metadata: findMetadataPda(umi, { mint: fromWeb3JsPublicKey(mint) }),
    updateAuthority: signer,
  };

  console.log("3-----------------------");

  const txid = await updateMetadataAccountV2(umi, {
    ...accounts,
    ...data,
  }).sendAndConfirm(umi);

  console.log("4-------------------------------");
  console.log(txid);
}

export default metadata;
