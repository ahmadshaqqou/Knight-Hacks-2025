from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='Morgan',
    description='Read and summarize emails for the lawyer',
    instruction='You have to read this email and get key details from it, such as but not limited to important dates, locations, and major developments in the case. Output your results as markdown bullet points for each key detail. Do not include any output except the markdown bullet point details',
)
