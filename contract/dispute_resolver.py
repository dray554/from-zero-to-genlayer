from genlayer import *

class DisputeResolver(gl.Contract):
    # 1. Use TreeMap for persistent storage
    disputes: TreeMap[str, str]

    def __init__(self):
        pass

    @gl.public.write
    def resolve_dispute(self, dispute_id: str, party_a_claim: str, party_b_claim: str):
        prompt = f"""
        You are a neutral arbitrator.
        Decide who is correct in this dispute.
        Respond strictly in JSON format: {{"winner": "A" or "B", "reason": "..."}}
        
        Party A: {party_a_claim}
        Party B: {party_b_claim}
        """

        # 2. This is the official way to reach consensus on AI output
        def get_verdict():
            return gl.exec_prompt(prompt)

        # We use 'strict_eq' to ensure validators agree on the exact JSON
        result = gl.eq_principle.strict_eq(get_verdict)

        # 3. Save to the persistent TreeMap
        self.disputes[dispute_id] = result
        return result

    @gl.public.view
    def get_dispute(self, dispute_id: str) -> str:
        return self.disputes.get(dispute_id, "Not found")
