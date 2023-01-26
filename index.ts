import { makeCompressedNFT } from "./helpers";
import { Keypair, PublicKey } from "@solana/web3.js";
import { WrappedConnection } from "./wrappedConnection";
import { createTree, createCollection, createNft } from "./lib";

const compression = async () => {
  const rpcUrl = "https://rpc-devnet.aws.metaplex.com/";
  const connectionString =
    "https://liquid.devnet.rpcpool.com/5ebea512d12be102f53d319dafc8";

    const connectionWrapper = new WrappedConnection(
    Keypair.fromSeed(new TextEncoder().encode("hello world".padEnd(32, "\0"))),
    connectionString,
    rpcUrl
  );

  // setting up the NFT metadata
  let originalCompressedNFT = makeCompressedNFT(
    "Degen Ape #1338",
    "DAA",
    "https://arweave.net/gfO_TkYttQls70pTmhrdMDz9pfMUXX8hZkaoIivQjGs"
  );

  // Create new Merkle tree
  const merkleTree = await createTree(
    connectionWrapper,
    connectionWrapper.payer
  );

  console.log("New Merkle tree created:", merkleTree.toBase58());

  // Create a new collection and mint NFT into tree created above
  const collectionMint = await createCollection(
    connectionWrapper,
    connectionWrapper.payer,
    originalCompressedNFT,
    merkleTree
  );

  console.log("Collection Mint:", collectionMint.toBase58());

  const mint = await createNft(
    connectionWrapper,
    connectionWrapper.payer,
    originalCompressedNFT,
    merkleTree,
    new PublicKey("GYUcLjJ5qEu7SNDADjzWs4f773moXvEGf4vvYoymYhpJ")
  )

  console.log("Mint:", mint)

};

compression();
