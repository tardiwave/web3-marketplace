import { ethers } from "ethers";
import { create as ipfsHttpClient, Options } from "ipfs-http-client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Web3Modal from "web3modal";
import NFTMarketplace from "../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { marketplaceAddress } from "../config";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0" as Options);

const CreateItem: NextPage = () => {
  const [fileUrl, setFileUrl] = useState<null | string>(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    /* upload image to IPFS */
    let file: File;
    if (e.target.files) {
      file = e.target.files[0];
      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`received: ${prog}`),
        });
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        setFileUrl(url);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  };
  const uploadToIPFS = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const listNFTForSale = async () => {
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* create the NFT */
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  };

  return (
    <div>
      <div>
        <input
          placeholder="Asset Name"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" onChange={onChange} />
        {fileUrl && <img width="350" src={fileUrl} />}
        <button onClick={listNFTForSale}>Create NFT</button>
      </div>
    </div>
  );
};
export default CreateItem;
