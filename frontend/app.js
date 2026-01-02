import { createClient, createAccount } from 'genlayer-js';
import { simulator } from 'genlayer-js/chains';

// 1. Initialize the GenLayer Client
const client = createClient({
    chain: simulator, 
});

// 2. Setup account
const account = createAccount();

// PASTE YOUR CONTRACT ADDRESS HERE
const CONTRACT_ADDRESS = '0xb7278A61aa25c888815aFC32Ad3cC52ff24fE575';

async function solveDispute() {
    const dId = document.getElementById('disputeId').value; // Match your HTML ID
    const c1 = document.getElementById('claimA').value;
    const c2 = document.getElementById('claimB').value;
    
    const resultDiv = document.getElementById('result');
    const status = document.getElementById('status');

    try {
        status.innerText = "⏳ AI Validators are reaching consensus...";
        resultDiv.style.display = 'none';

        // 3. Write to the Intelligent Contract
        const hash = await client.writeContract({
            account: account,
            address: CONTRACT_ADDRESS,
            functionName: 'resolve_dispute',
            // Pass the Dispute ID and the two claims
            args: [dId, c1, c2], 
        });

        // 4. Wait for AI Validators to reach consensus
        // Note: Use 'FINALIZED' or 'ACCEPTED' depending on your speed needs
        const receipt = await client.waitForTransactionReceipt({ 
            hash, 
            status: 'FINALIZED' 
        });

        // 5. Parse the AI verdict
        // receipt.execution_result is a string, so we turn it into a JS object
        const data = JSON.parse(receipt.execution_result);
        
        document.getElementById('verdict').innerText = `Winner: Party ${data.winner}`;
        document.getElementById('reasoning').innerText = data.reason;
        
        status.innerText = "✅ Verdict Rendered";
        resultDiv.style.display = 'block';

    } catch (error) {
        console.error("Dispute resolution failed:", error);
        status.innerText = "❌ Error: AI consensus could not be reached.";
    }
}

window.solveDispute = solveDispute;
