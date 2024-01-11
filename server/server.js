const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
// const { fetchAnswers } = require("./utils/api");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./schemas/resolvers");
const db = require("./config/connection");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { createClient } = require("pexels");

const PORT = process.env.PORT || 3000;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const fetchAnswers = async (userInput) => {
  const openAIApiKey = process.env.OPENAI_API_KEY;
  console.log(openAIApiKey);

  if (!openAIApiKey) {
    console.error("could not find it!");
    return;
  }

  const llm = new ChatOpenAI({ openAIApiKey });

  const promptTemplate =
    "You are in a AAC device. Give 10 1-5 word responses to the following topic or question to be used as a button to be pressed by an adult with developmental disabilities. do not start the response with a number separate each new response with a new line: {promptText}";

  const responsePrompt = PromptTemplate.fromTemplate(promptTemplate);
  const responseChain = responsePrompt.pipe(llm);

  try {
    const result = await responseChain.invoke({
      promptText: userInput,
    });

    console.log("this is what I got back from chatgpt, ", result);
    console.log("Question or Topic:", userInput);
    console.log("Chat GPT Responses:", result.content);
    return result;
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

app.use(cors());
app.use(bodyParser.json());

const fetchImages = async (searchTerm) => {
  const query = searchTerm;

  const client = createClient(process.env.PEXELS_API_KEY);

  try {
    const data = await client.photos.search({ query, per_page: 1 });
    console.log("Here sht image data I got back, ", data);
    return data;
  } catch (error) {
    console.error("Error fetching Pexels data:", error);
  }
};

const fetchCustomImages = async (searchTerm) => {
  const query = searchTerm;

  const client = createClient(process.env.PEXELS_API_KEY);

  try {
    const data = await client.photos.search({ query, per_page: 5 });
    console.log("Here sht image data I got back, ", data);
    return data;
  } catch (error) {
    console.error("Error fetching Pexels data:", error);
  }
};

app.post("/api/fetchAnswers", async (req, res) => {
  console.log(req.body);
  const { userInput } = req.body;

  try {
    const chatGPTResults = await fetchAnswers(userInput);
    res.json(chatGPTResults);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/fetchImage", async (req, res) => {
  console.log(req.body);
  const { searchTerm } = req.body;

  try {
    const imageResult = await fetchImages(searchTerm);
    res.json(imageResult);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/fetchCustomImage", async (req, res) => {
  console.log(req.body);
  const { searchTerm } = req.body;

  try {
    const imageResult = await fetchCustomImages(searchTerm);
    res.json(imageResult);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
