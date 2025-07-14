require("dotenv").config();
const express = require("express");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./schemas/resolvers");
const bodyParser = require("body-parser");
const db = require("./config/connection");
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

  if (!openAIApiKey) {
    console.error("❌ OPENAI_API_KEY not found in environment variables.");
    throw new Error("Missing OpenAI API key");
  }

  const llm = new ChatOpenAI({ openAIApiKey });

  const promptTemplate =
    "You are in a AAC device. Give 6 1-2 word responses to the following topic or question to be used as a button to be pressed by an adult with developmental disabilities. do not start the response with a number. separate each new response with a new line: {promptText}";

  const responsePrompt = PromptTemplate.fromTemplate(promptTemplate);
  const responseChain = responsePrompt.pipe(llm);

  try {
    console.log("📤 Sending prompt to OpenAI:", userInput);

    const result = await responseChain.invoke({
      promptText: userInput,
    });

    console.log("✅ Raw result from LangChain/OpenAI:", result);
    console.log("🧪 Type of result:", typeof result);

    if (!result || typeof result !== "object") {
      throw new Error("Unexpected result type from OpenAI");
    }

    if (!result.content) {
      console.error(
        "❌ 'content' property is missing from the OpenAI response."
      );
      console.log("🧾 Full result object:", JSON.stringify(result, null, 2));
      throw new Error("Missing 'content' in OpenAI response");
    }

    return { content: result.content };
  } catch (error) {
    console.error(
      "❌ Error fetching data from OpenAI via LangChain:",
      error.message
    );
    throw error;
  }
};

app.use(cors());
app.use(bodyParser.json());

// Fetching a corresponding image for the responses from OpenAI
const fetchImages = async (searchTerm) => {
  const query = searchTerm;

  const client = createClient(process.env.PEXELS_API_KEY);

  try {
    const data = await client.photos.search({ query, per_page: 1 });

    return data;
  } catch (error) {
    console.error("Error fetching Pexels data:", error);
  }
};

//Fetches 10 possible images for the user to select when they are making a custom response
const fetchCustomImages = async (searchTerm) => {
  const query = searchTerm;

  const client = createClient(process.env.PEXELS_API_KEY);

  try {
    const data = await client.photos.search({ query, per_page: 10 });

    return data;
  } catch (error) {
    console.error("Error fetching Pexels data:", error);
  }
};

app.post("/api/fetchAnswers", async (req, res) => {
  const { userInput } = req.body;

  try {
    const chatGPTResults = await fetchAnswers(userInput);
    res.json(chatGPTResults);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/fetchImages", async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const imageResult = await fetchImages(searchTerm);
    res.json(imageResult);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/fetchCustomImages", async (req, res) => {
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
