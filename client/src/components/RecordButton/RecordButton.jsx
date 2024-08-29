import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
// import { createClient } from "pexels";
import axios from "axios";
import BigResponse from "../BigResponseComponent/BigResponse";
import "./RecordButton.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { QUERY_ME } from "../../../utils/queries";
import { ADD_RESPONSE } from "../../../utils/mutations";

import { bouncy } from "ldrs";
import ResponsesList from "../ResponsesList/ResponsesList";

bouncy.register();

export default function RecordButton() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [promptText, setPromptText] = useState("");
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [addResponse, { error: responseError }] = useMutation(ADD_RESPONSE);
  const [isFetchedAnswers, setIsFetchedAnswers] = useState(false);
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const { loading, data } = useQuery(QUERY_ME);

  useEffect(() => {
    if (!loading && data && data.me) {
      setUserId(data.me._id);
    }
  }, [loading, data]);

  const addCustomResponse = async (response, imageURL) => {
    setResponses([...responses, response]);
    setImageURLs([...imageURLs, imageURL]);
  };

  const fetchAnswersAndImages = async () => {
    setResponsesLoading(true);
    try {
      const response = await axios.post(
        `https://ai-aac-db2.onrender.com/api/fetchAnswers`,
        {
          userInput,
        }
      );

      const chatGPTResults = response.data.kwargs?.content;
      console.log("chatgptresults", chatGPTResults);
      if (!chatGPTResults) {
        console.error(
          "Error: 'content' property is undefined in the response data."
        );
        return;
      }
      const testingArray = [
        "1. chicken",
        "2. sphaghetti",
        "3. burger",
        "4. tacos",
        "5. Kimchi Jjigae",
        "6. Soondubu",
      ];
      const chatGPTResultsArray = chatGPTResults.split("\n");
      const filteredChatGPTResults = chatGPTResultsArray.map((response) =>
        response.replace(/[\d.]+/g, "")
      );
      const filteredTestResults = testingArray.map((response) =>
        response.replace(/\d+/g, "")
      );
      setResponses(filteredChatGPTResults);
      console.log(
        "here are my responses. I am in the RecordButton JSX, ",
        responses
      );
      console.log(
        "This is the type of responses in RecordButton:",
        typeof responses
      );
      console.log(
        "This is the type of responses in RecordButton:",
        Array.isArray(responses) ? "array" : typeof responses
      );
      const newImageURLs = [];

      await Promise.all(
        chatGPTResultsArray.map(async (response, index) => {
          try {
            const imageData = await axios.post(
              `https://ai-aac-db2.onrender.com/api/fetchImages`,
              {
                searchTerm: response,
              }
            );

            if (imageData.data.photos && imageData.data.photos.length > 0) {
              const imageSrc = imageData.data.photos[0].src.medium;
              newImageURLs[index] = imageSrc;
            } else {
            }
          } catch (imageError) {
            console.error("Error fetching image data:", imageError);
          }
        })
      );

      setImageURLs(newImageURLs);
      setIsFetchedAnswers(true);
      setResponsesLoading(false);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  return (
    <div>
      <Form.Control
        className="mb-3"
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter a topic or question and OpenAI will create 6 possible responses"
      />
      <div className="button-container">
        <div className="d-grid gap-2">
          <Button
            className="fetch-button"
            variant="secondary"
            size="lg"
            onClick={fetchAnswersAndImages}
          >
            Generate Responses
          </Button>
        </div>
      </div>

      <div>
        {responsesLoading ? (
          <div className="loadingAnimation">
            <l-bouncy size="65" speed="1.75" color="purple"></l-bouncy>
          </div>
        ) : (
          <div>
            {/* <BigResponse
              responses={responses}
              isFetchedAnswers={isFetchedAnswers}
              promptText={userInput}
              userId={userId}
              imageURLs={imageURLs}
              addCustomResponse={addCustomResponse}
            /> */}
            <ResponsesList
              responses={responses}
              imageURLs={imageURLs}
              promptText={userInput}
              userId={userId}
              isFetchedAnswers={isFetchedAnswers}
              addCustomResponse={addCustomResponse}
            />
          </div>
        )}
      </div>
    </div>
  );
}
