import { useState, useEffect } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import { createClient } from "pexels";
import BigResponse from "../BigResponseComponent/BigResponse";
import ResponseForm from "../ResponseForm/ResponseForm";
import TopicForm from "../TopicForm/TopicForm";
import "./RecordButton.scss";

export default function RecordButton() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [promptText, setPromptText] = useState("");
  const [imageURLs, setImageURLs] = useState([]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const { loading, data } = useQuery(QUERY_ME);
  const userId = data?.me._id;


  const fetchAnswers = async () => {
    const openAIApiKey = process.env.API_KEY;

    const llm = new ChatOpenAI({ openAIApiKey });

    const promptTemplate =
      "You are in a AAC device. Give 10 1-5 word responses to the following topic or question to be used as a button to be pressed by an adult with developmental disabilities. do not start the response with a number separate each new response with a new line: {promptText}";

    const responsePrompt = PromptTemplate.fromTemplate(promptTemplate);
    const responseChain = responsePrompt.pipe(llm);
    setResponses([]);

    try {
      const result = await responseChain.invoke({
        promptText: userInput,
      });

      setPromptText(userInput);
      console.log("this is what I got back from chatgpt, ", result);
      console.log("Question or Topic:", userInput);
      console.log("Chat GPT Responses:", result.content);

      const newResponses = result.content.split("\n");
      console.log("This is the array we will map over, ", newResponses);
      setResponses(newResponses);

      const newImageURLs = [];
      // Loop through responses to fetch and save image URLs
      newResponses.forEach((response, index) => {
        const query = response;

        const client = createClient(
          "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"
        );

        client.photos
          .search({ query, per_page: 1 })
          .then((data) => {
            console.log("client.photos data", data);
            const imageSrc =
              data.photos.length > 0 ? data.photos[0].src.medium : null;
            console.log(imageSrc);
            newImageURLs[index] = imageSrc; // Save each image URL at the corresponding index
            setImageURLs([...newImageURLs]); // Update the state with the new array of image URLs
          })
          .catch((error) => {
            console.error("Error fetching Pexels data:", error);
          });
      });
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };


  return (
    <div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter a topic or question"
        className="input-field"
      />
      <button className="fetch-button" onClick={fetchAnswers}>
        Fetch
      </button>

      <div>
        <BigResponse
          responses={responses}
          promptText={promptText}
          userId={userId}
          imageURLs={imageURLs}
        />
      </div>
    </div>
  );
}
