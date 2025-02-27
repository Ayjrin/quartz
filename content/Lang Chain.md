orchestration framework that use LLMs
generic interface for any LLM
streamlines the programming of llm apps through abstraction


### TL;DR
LLM calls doing things but abstracted into dev based function calls

### Tools
#### Components
- llm wrapper (outer function)
- prompt templates (inner function)
- indexes for relevant info retrieval
- f( g( x ))

#### Chains
- Assemble components to solve a specific task

#### Agents 
- Agents allow LLMs to interact with its environment



Prompt Templates in detail
- blueprints for prompts
- reusable and structured
- dynamic prompt creation
- Why:
	- Consistency of fomat leading to more reliable llm outputs
	- reusability - saving time by reusing prompt structures accross different parts of the app
	- Clarity and Organization - Makes your code cleaner and easier to understand by separating the prompt structure from the specific data being inserted
	- Dynamic input - allows us to easily incorporate use inputs, context variables, and other dynamic data
	- Prompt engineering - mostly a thing of the past, but this will probably be able to be automated with versioning in the future

### What's missing

-  LLM based decision making
-  Versioning
-  Business connection
-  Codeless solution for higher adaptability 
