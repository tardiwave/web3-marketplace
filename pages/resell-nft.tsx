/* pages/resell-nft.js */
import axios from "axios";
import { BigNumberish, ethers } from "ethers";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";
import { NFTMarketplace__factory } from "../typechain";

const ResellNFT: NextPage = () => {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  const fetchNFT = async () => {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI as string);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  };

  const listNFTForSale = async () => {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
    const contract = NFTMarketplace__factory.connect(
      marketplaceAddress,
      provider
    );
    const listingPrice = await contract.getListingPrice();
    const listingPriceString = listingPrice.toString();
    let transaction = await contract.resellToken(
      id as BigNumberish,
      priceFormatted,
      {
        value: listingPriceString,
      }
    );
    await transaction.wait();

    router.push("/");
  }

  return (
    <div>
      <div>
        <input
          placeholder="Asset Price in Eth"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && <img width="350" src={image} />}
        <button onClick={listNFTForSale}>List NFT</button>
      </div>
    </div>
  );
};
export default ResellNFT;
