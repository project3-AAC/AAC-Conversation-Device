# Talker - AI Powered AAC Device

# Elevator Pitch

Introducing an AI-driven AAC (Augmentative and Alternative Communication) device designed to effortlessly generate responses to prompts or questions, specifically tailored to support individuals with expressive communication disorders. Our innovative technology empowers users by revolutionizing speech production, fostering meaningful interactions between indivduals with differenct communication limitations and preferences, and easing the learning curve for parents, guardians, or other caretakers setting up AAC devices by automatically populating conversation pages. Harnessing the power of OpenAI, we're dedicated to enhancing the agency and communication abilities of individuals with disabilities.

# Description

AI-driven Augmentative and Alternative Communication (AAC) | Input your topic or question, and receive a curated selection of six potential answers tailored to your needs. Engineered with a focus on individuals with expressive communication disorders, our device offers seamless accessibility and empowerment.

# Instructions

Navigate to [Talker](https://ai-aac-db2.onrender.com/) and begin by clicking sign up to create an account, or by entering a prompt or question into the search bar (e.g. "What did you have for breakfast?" or "Let's talk about the Olympics"). The application will create 6 possible resposnes to the prompt given, and populate the page with the text of a response and a corresponding image. The user can then touch or click one of the responses and it will be read aloud by the device used. The user can also create custom responses and search for correspdong images via clicking the "Create Custom Response Button".

IF the user is logged in, they can save the prompt and responses by clicking the "Save Topic and Responses" button, and then edit them further by clicking on the "Edit Topic" button. Once on the topic page, they can toggle edit mode by selecting the edit icon, allowing them to delete the response or change the text and image. They may also continue to add custom responses from this page, and the responses will automatically be saved.

To view all of the saved topics, the user can navigate to the homepage or their user page, where they can select a topic by clicking or touching it.

# Application Link

[Github Repository](https://github.com/project3-AAC/AAC-Conversation-Device)

[Render Deployment](https://ai-aac-db2.onrender.com/)

# Screenshots

![Homepage](https://github.com/project3-AAC/AAC-Conversation-Device/assets/122508345/a1b1ddcd-6701-4fe7-9e6c-d0e58822b56f)
![AI Generated Responses](https://github.com/project3-AAC/AAC-Conversation-Device/assets/122508345/85ec2117-4a9d-4a13-a7e7-608a111489e2)
![Custom Response](https://github.com/project3-AAC/AAC-Conversation-Device/assets/122508345/deb803a3-dba7-469b-8b39-7b8d03da3cae)
![Saved Topics](https://github.com/project3-AAC/AAC-Conversation-Device/assets/122508345/5c502e0a-1232-4ef4-b9ae-477e05319346)

# Technologies

- JavaScript
- Node.js
  - MongooseDB
  - Dotenv
  - LangChain
  - Sass
  - bcrypt
- Express
- React
- MongoDB
- APIS:
  - OpenAI
  - Pexels

# Contributions

- [OpenAI](https://openai.com/)
- [MongoDB Atlas](https://www.youtube.com/watch?v=lyOgmd8U99c&ab_channel=FullStackCoder)
- [Render Deployment Tutorial](https://www.google.com/search?q=how+to+deploy+from+github+to+render&sca_esv=595826640&sxsrf=AM9HkKlavTzUNV05FoKhBG3VP3IToqm9PQ%3A1704417685891&source=hp&ei=lVmXZbmENI-IptQPu4yN-AM&iflsig=AO6bgOgAAAAAZZdnpWCmvNF0ZrtOQqrbrCqMEig2a7Go&ved=0ahUKEwj5otvVisWDAxUPhIkEHTtGAz8Q4dUDCAw&uact=5&oq=how+to+deploy+from+github+to+render&gs_lp=Egdnd3Mtd2l6IiNob3cgdG8gZGVwbG95IGZyb20gZ2l0aHViIHRvIHJlbmRlcjIFECEYoAEyBRAhGKABMgUQIRigATIIECEYFhgeGB1Iuk9QAFjSTnAAeACQAQCYAWGgAbkRqgECMzW4AQPIAQD4AQHCAgoQIxiABBiKBRgnwgIQEC4YgAQYigUYQxjHARjRA8ICERAuGIAEGLEDGIMBGMcBGNEDwgILEAAYgAQYsQMYgwHCAg4QLhiABBixAxjHARjRA8ICChAAGIAEGIoFGEPCAgUQABiABMICBRAuGIAEwgILEAAYgAQYigUYsQPCAgsQABiABBiKBRiRAsICCBAAGIAEGLEDwgILEAAYgAQYigUYhgPCAgYQABgWGB7CAggQABgWGB4YCg&sclient=gws-wiz#fpstate=ive&vld=cid:75ddf26a,vid:mJASUXzjMQA,st:0)
- [Langchain Setup](https://www.youtube.com/watch?v=HSZ_uaif57o)
- [Bootstrap](https://www.w3schools.com/bootstrap/default.asp)
- [Langchain Troublehsooting](https://nanonets.com/blog/langchain/)
- [Bcrypt Troubleshooting](https://www.npmjs.com/package/bcrypt)
- [React Troubleshooting](https://www.w3schools.com/react/)
- [Express Resource](https://expressjs.com/)
- [Sass Resource](https://sass-lang.com/documentation/)

The following files were leveraged and modified from Northwestern Coding Bootcamp's Practice Modules

- package.json (source: 21-MERN/21-MERN/25-Ins_Resolver_Context/package.json)
- client/src/App.jsx (source: 21-MERN/25-Ins_Resolver_Context/client/src/App.jsx)
- client/src/pages/Login.jsx (source: 21-MERN/25-Ins_Resolver_Context/client/src/pages/Login.jsx)
- client/src/pages/Signup.jsx (source: 21-MERN/25-Ins_Resolver_Context/client/src/pages/Signup.jsx)

- server/config/connections.js (source: 21-MERN/25-Ins_Resolver_Context/server/config/connections.js)
- server/models/User.js (source: 21-MERN/25-Ins_Resolver_Context/server/models/Profile.js)
- server/schemas/index.js (source: 21-MERN/25-Ins_Resolver_Context/server/schemas/index.js)
- server/schemas/typeDefs.js (source: 21-MERN/25-Ins_Resolver_Context/server/schemas/typeDefs.js)
- server/schemas/resolvers.js (source: 21-MERN/25-Ins_Resolver_Context/server/schemas/resolvers.js)
- server/seeders/cleanDB.js (source: 21-MERN/25-Ins_Resolver_Context/server/seeders/cleanDb.js)
- server/seeders/seed.js (source: 21-MERN/25-Ins_Resolver_Context/server/seeders/seed.js)
- server/utils/auth.js (source: 21-MERN/25-Ins_Resolver_Context/server/utils/auth.js)
- server/server.js (source: 21-MERN/25-Ins_Resolver_Context/server/server.js)

# License

MIT License

Copyright (c) 2023 [Broca's Basilisk](https://github.com/project3-AAC)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
