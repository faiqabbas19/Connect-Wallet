import { Agent } from "https";
import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";

const {
    NEXT_PUBLIC_TEMPLATE_CLIENT_ID, 
    BACKEND_WALLET_ADDRESS,   
    NFT_CONTRACT_ADDRESS,
    ENGINE_URL,
    THIRDWEB_SECRET_KEY
} = process.env;

const agent = new Agent({
    rejectUnauthorized: false,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!BACKEND_WALLET_ADDRESS || !NFT_CONTRACT_ADDRESS || !ENGINE_URL || !THIRDWEB_SECRET_KEY) {
        console.error("Missing environment variables");
        return res.status(500).json({ message: 'missing environment variables' });
    }

    const { useActiveAccount } = req.body;
    console.log('Request body:', req.body);
    console.log('useActiveAccount:', useActiveAccount);

    try {
        const response = await fetch(
            `${ENGINE_URL}/contract/sepolia/${NFT_CONTRACT_ADDRESS}/erc1155/claim-to`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
                    "x-backend-wallet-address": BACKEND_WALLET_ADDRESS, // Corrected header name
                },
                body: JSON.stringify({
                    receiver: useActiveAccount,
                    tokenId: "0",
                    quantity: "1",
                }),
                agent: agent,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        return res.status(200).json({ message: 'Success' });
    } catch (error: any) {
        console.error("Error in API route:", error);
        return res.status(500).json({ message: error.message });
    }
}
