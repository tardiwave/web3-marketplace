import axios from "axios";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import NFTMarketplace from "../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { marketplaceAddress } from "../config";
import type { NFTInterface } from "../models/nft.model";
import { NFTMarketplace__factory } from "../typechain";

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<NFTInterface[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  const loadNFTs = async () => {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ROPSTEN_URL
    );
     const contract = NFTMarketplace__factory.connect(
       marketplaceAddress,
       provider
     );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  };
  const buyNft = async (nft: NFTInterface) => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  };
  if (loadingState === "loaded" && !nfts.length)
    return <h1>No items in marketplace</h1>;
  return (
    <div>
      <div>
        <div>
          {nfts.map((nft, i) => (
            <div key={i}>
              <img src={nft.image} />
              <div>
                <p>{nft.name}</p>
                <div>
                  <p>{nft.description}</p>
                </div>
              </div>
              <div>
                <p>{nft.price} ETH</p>
                <button onClick={() => buyNft(nft)}>Buy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
