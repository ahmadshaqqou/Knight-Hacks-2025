from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='Morgan',
    description='A helpful assistant for comforting a client.',
    instruction='My client recently went through an event. Write a letter to them',
)

#root_agent.serve(port=8000)