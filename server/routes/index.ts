import { ethers } from "ethers";
export const CHILIZ_SPICY_TESTNET_CONFIG = {
  chainId: "0x15b32",
  rpcTarget: "https://spicy-rpc.chiliz.com/",
  displayName: "Chiliz Spicy Testnet",
  blockExplorerUrl: "https://testnet.chiliscan.com/",
  ticker: "CHZ",
  tickerName: "Chiliz",
};

export default eventHandler(async (event) => {
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
      value: ethers.utils.parseEther("0.1"),
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
      // error: error.message as any,
    });
  }
});
