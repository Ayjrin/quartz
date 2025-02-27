Lang graph is an AI building framework

Similarly to [[Lang Chain]], Lang Graph will walk through a series of discrete and LLM based tasks, with a few key differences. Instead of an LLM being the sole doer of the task, the LLM will choose the right tool based on the information provided. 

Instead of a person, or an event, triggering a [[Lang Chain]], a LangGraph will get take a prompt as an input pass all the relevant information to an LLM to choose a tool from a list of prescripted options. 

### Building Blocks

-  Node
-  Edge
-  Conditional Edge
-  State

### Examples
![[Pasted image 20250224145828.png]]
![[Pasted image 20250224144956.png]]

### [Persistence](https://langchain-ai.github.io/langgraph/concepts/high_level/#persistence "Permanent link")

LangGraph has a [persistence layer](https://langchain-ai.github.io/langgraph/concepts/persistence/), which offers a number of benefits:

- [Memory](https://langchain-ai.github.io/langgraph/concepts/memory/): LangGraph persists arbitrary aspects of your application's state, supporting memory of conversations and other updates within and across user interactions;
- [Human-in-the-loop](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/): Because state is checkpointed, execution can be interrupted and resumed, allowing for decisions, validation, and corrections via human input.

### Streaming[¶](https://langchain-ai.github.io/langgraph/concepts/high_level/#streaming "Permanent link")

LangGraph also provides support for [streaming](https://langchain-ai.github.io/langgraph/how-tos/#streaming) workflow / agent state to the user (or developer) over the course of execution. LangGraph supports streaming of both events ([such as feedback from a tool call](https://langchain-ai.github.io/langgraph/how-tos/streaming/#updates)) and [tokens from LLM calls](https://langchain-ai.github.io/langgraph/how-tos/streaming-tokens/) embedded in an application.

### Debugging and Deployment[¶](https://langchain-ai.github.io/langgraph/concepts/high_level/#debugging-and-deployment "Permanent link")

LangGraph provides an easy onramp for testing, debugging, and deploying applications via [LangGraph Platform](https://langchain-ai.github.io/langgraph/concepts/langgraph_platform/). This includes [Studio](https://langchain-ai.github.io/langgraph/concepts/langgraph_studio/), an IDE that enables visualization, interaction, and debugging of workflows or agents. This also includes numerous [options](https://langchain-ai.github.io/langgraph/tutorials/deployment/) for deployment.