import axios from "axios";
import LIST from "./holders.json";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTokens(wallet, min_price, listStatus) {
  try {
    const response = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/wallets/${wallet}/tokens`,
      {
        params: {
          collection_symbol: "the_invincibles",
          limit: 100,
          min_price: min_price,
          listStatus: listStatus,
        },
        headers: {
          accept: "application/json",
        },
      }
    );

    // Handle the response data
    console.log(response.data);
  } catch (error) {
    // Handle any errors
    console.error(error);
  }
}
///https://docs.magiceden.io/reference/get_wallets-wallet-address-tokens
// Use this API to filter every user details and how much nft they have and the listing price
//use top to bottom condition
//check number of nft then condition from not listed to listed to price condition


const BRONZE = [];
const GOLD = [];
const SILVER = [];
const DIAMOND = [];


const main = async () => {
  const min_price = 0.25;
  for (let i = 0; i < LIST.length; i++) {
    const wallet = LIST[i];
    const tokenUserData = getTokens(wallet, min_price, "both");
    let isAboveMintPrice;
    let isBelowMintPrice;
    let isDoubleBelowMintPrice;
    let isListed;
    let totalNft = tokenUserData.length - 1;
    tokenUserData.map((data) => {
      if (data.listStatus === "listed") {
        isListed = true;
        if (data.price > min_price) isAboveMintPrice = true;
        if (data.price < min_price) isBelowMintPrice = true;
      }
      if (totalNft > 21 && totalNft < 50) {
        isDoubleBelowMintPrice = min_price * 2 <= data.price;
      }
    });
    if (totalNft >= 1 && totalNft <= 5) {
      if (!isListed) {
        BRONZE.push({ wallet, tickets: 1 });
      }
    } else if (totalNft >= 6 && totalNft <= 10) {
      if (isListed && !isBelowMintPrice) {
        BRONZE.push({ wallet, tickets: 3 });
      } else if (!isListed) {
        SILVER.push({ wallet, tickets: 3 });
      }
    } else if (totalNft >= 11 && totalNft <= 20) {
      if (!isListed) {
        GOLD.push({ wallet, tickets: 5 });
      } else if (isListed && !isBelowMintPrice) {
        SILVER.push({ wallet, tickets: 5 });
      } else {
        BRONZE.push({ wallet, tickets: 5 });
      }
    } else if (totalNft >= 21 && totalNft <= 50) {
      if (isListed && !isBelowMintPrice && isDoubleBelowMintPrice) {
        GOLD.push({ wallet, tickets: 5 });
      } else {
        SILVER.push({ wallet, tickets: 5 });
      }
    } else if (totalNft >= 51 && totalNft <= 99) {
      if (!isListed) {
        DIAMOND.push({ wallet, tickets: 7 });
      } else {
        GOLD.push({ wallet, tickets: 7 });
      }
    } else if (totalNft >= 100) {
      DIAMOND.push({ wallet, tickets: 10 });
    }
    delay(800)
  }
};
