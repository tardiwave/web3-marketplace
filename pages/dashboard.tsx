/* pages/dashboard.js */
import axios from "axios";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";
import type { NFTInterface } from "../models/nft.model";
import { NFTMarketplace__factory } from "../typechain";

const CreatorDashboard: NextPage = () => {
  const [nfts, setNfts] = useState<NFTInterface[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  const loadNFTs = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = NFTMarketplace__factory.connect(
      marketplaceAddress,
      provider
    );
    const data = await contract.fetchItemsListed();

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
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  };
  if (loadingState === "loaded" && !nfts.length) return <h1>No NFTs listed</h1>;
  return (
    <div>
      <div>
        <h2>Items Listed</h2>
        <div>
          {nfts.map((nft, i) => (
            <div key={i}>
              <img src={nft.image} />
              <div>
                <p>Price - {nft.price} Eth</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CreatorDashboard;
