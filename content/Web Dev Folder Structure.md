
This file covers this [video](https://www.youtube.com/watch?v=xyxrB2Aa7KE)

## General example for [Folder Structure] for simple web dev to do app
```
├── app/
|   └── TodoPage.tsx
├── components/
|   ├── TodoList.tsx
|   └── TodoForm.tsx
├── db.ts
├── actions/
|   └── saveTodo.ts
```

this kinda sucks as soon as you add one or two features.

[features] should have their own folder that mirrors the global folder. Instead of trying to manage features spead accross the entire project, they are centralized to the specific, local feature that they are implementing. The goal is to group by feature and not group by technology.

### Group by Feature not by Technology
 - Blue - Shared
 - Red - Application
 - Green - Local / Features
 ![[Pasted image 20250203105529.png]]

If you are working on products, you never have to worry about users. The app/ handles that. Features do not call each other.

### Data Flow

![[Pasted image 20250203105827.png]]


Shared folder cannot access anything from app or features
App can use both connecting everything
Features can pull from shared, but not from app

Enforce this all through [eslintrc].json 

find an example eslintrc [here](https://github.com/WebDevSimplified/parity-deals-clone/blob/feature-folder-structure/.eslintrc.json)



