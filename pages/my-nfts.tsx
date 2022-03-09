/* pages/my-nfts.js */
import axios from "axios";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";
import type { NFTInterface } from "../models/nft.model";
import { NFTMarketplace__factory } from "../typechain";

const MyNFTs: NextPage = () => {
  const [nfts, setNfts] = useState<NFTInterface[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
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
    const contract = NFTMarketplace__factory.connect(
      marketplaceAddress,
      provider
    );
    const data = await contract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  const listNFT = (nft: NFTInterface) => {
    console.log("nft:", nft);
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  };
  if (loadingState === "loaded" && !nfts.length) return <h1>No NFTs owned</h1>;
  return (
    <div>
      <div>
        <div>
          {nfts.map((nft, i) => (
            <div key={i}>
              <img src={nft.image} />
              <div>
                <p>Price - {nft.price} Eth</p>
                <button onClick={() => listNFT(nft)}>List</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MyNFTs;
