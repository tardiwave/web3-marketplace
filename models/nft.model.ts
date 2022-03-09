export interface NFTInterface{
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: any;
  tokenURI?: string;
  name?: string;
  description?: string;
}
