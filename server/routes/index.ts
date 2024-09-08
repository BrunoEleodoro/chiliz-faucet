import { ethers } from "ethers";
import { defineEventHandler, getQuery, createError, setResponseHeaders } from 'h3';

export const CHILIZ_SPICY_TESTNET_CONFIG = {
  chainId: "0x15b32",
  rpcTarget: "https://spicy-rpc.chiliz.com/",
  displayName: "Chiliz Spicy Testnet",
  blockExplorerUrl: "https://testnet.chiliscan.com/",
  ticker: "CHZ",
  tickerName: "Chiliz",
};

export default defineEventHandler(async (event) => {
  // Set CORS headers
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  // Handle preflight requests
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.end();
    return;
  }

  const address = getQuery(event).address as string;

  if (!address) {
    return createError({
      statusCode: 400,
      message: "Address parameter is required",
    });
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    return createError({
      statusCode: 500,
      message: "Private key not found in environment variables",
    });
  }

  const provider = new ethers.providers.JsonRpcProvider(CHILIZ_SPICY_TESTNET_CONFIG.rpcTarget);
  const wallet = new ethers.Wallet(privateKey, provider);

  try {
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("1"),
    });

    await tx.wait();

    return {
      message: "Faucet transfer successful",
      txHash: tx.hash,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      message: "Faucet transfer failed" + error.message,
    });
  }
});
