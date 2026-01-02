import { createClient, createAccount } from 'genlayer-js';
import { simulator } from 'genlayer-js/chains';

// 1. Initialize the GenLayer Client
const client = createClient({
    chain: simulator, // Change to testnetAsimov for production
});

// 2. Setup a temporary account for the tutorial
const account = createAccount();

async function solveDispute() {
    const p1 = document.getElementById('partyA').value;
    const p2 = document.getElementById('partyB').value;
    const c1 = document.getElementById('claimA').value;
    const c2 = document.getElementById('claimB').value;
    
    const resultDiv = document.getElementById('result');
    const status = document.getElementById('status');

    try {
        resultDiv.style.display = 'none';
        console.log("Submitting dispute to GenLayer...");

        // 3. Write to the Intelligent Contract
        // Replace '0x000...' with your actual deployed contract address from Studio
        const hash = await client.writeContract({
            account: account,
            address: 'YOUR_CONTRACT_ADDRESS_HERE',
            functionName: 'resolve_dispute',
            args: ['dispute_1', c1, c2],
        });

        // 4. Wait for AI Validators to reach consensus (Optimistic Democracy)
        const receipt = await client.waitForTransactionReceipt({ 
            hash, 
            status: 'FINALIZED' 
        });

        // 5. Display the structured AI verdict
        const data = JSON.parse(receipt.execution_result);
        document.getElementById('verdict').innerText = `Winner: Party ${data.winner}`;
        document.getElementById('reasoning').innerText = data.reason;
        resultDiv.style.display = 'block';

    } catch (error) {
        console.error("Dispute resolution failed:", error);
    }
}

// Make the function available to the HTML button
window.solveDispute = solveDispute;
