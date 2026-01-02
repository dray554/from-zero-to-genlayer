     # { "Depends": "py-genlayer:test" }
from genlayer import *

class DisputeResolver(gl.Contract):
    # This must be outside __init__ to be permanent on the blockchain
    # TreeMap[Key, Value] tells the Studio exactly what types to expect
    disputes: TreeMap[str, str]

    def __init__(self) -> None:
        # Initialize the TreeMap here to ensure it's ready
        self.disputes = TreeMap[str, str]()

    @gl.public.write
    def resolve_dispute(self, dispute_id: str, party_a_claim: str, party_b_claim: str) -> str:

        """
        Processes a dispute between two parties using AI consensus.
        The yellow lines often disappear when you add '-> str' return types.
        """
        
        # We keep your full prompt logic here
        prompt: str = f"""
        You are a neutral arbitrator.
        Decide who is correct in this dispute.
        Respond strictly in the following JSON format:

        {{
            "winner": "A" or "B",
            "reason": "<short explanation>"
        }}

        Party A claim: {party_a_claim}
        Party B claim: {party_b_claim}
        """

        # This inner function is required for the Equivalence Principle
        def get_verdict() -> str:
            return gl.exec_prompt(prompt)

        # 'strict_eq' is the GenLayer way of reaching consensus
        # It ensures all validators agree on the AI's JSON output
        result: str = gl.eq_principle.strict_eq(get_verdict)

        # Save the result to the blockchain's permanent storage
        self.disputes[dispute_id] = result

        return result

    @gl.public.view
    def get_dispute_result(self, dispute_id: str) -> str:
        """
        Allows anyone to check the status of a dispute without paying gas.
        """
        # .get() prevents the contract from crashing if the ID doesn't exist
        return self.disputes.get(dispute_id, "Dispute ID not found in records.")
