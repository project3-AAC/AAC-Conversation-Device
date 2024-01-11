import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TOPIC, ADD_RESPONSE } from "../../../utils/mutations";
import "./BigResponse.scss";

const BigResponse = ({ userId, promptText, responses, imageURLs }) => {
  const [addTopic, { error: topicError }] = useMutation(ADD_TOPIC);
  const [addResponse, { error: responseError }] = useMutation(ADD_RESPONSE);
  const [topicId, setTopicId] = useState(null);
  const [response, setResponse] = useState("");

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  console.log("this is the promptText,", promptText);

  const fetchCustomImage = async (event, index) => {
    event.preventDefault();
    const newResponse = prompt(`Enter new text for response ${index + 1}`);
    if (newResponse !== null) {
      const updatedResponses = [...responses];
      updatedResponses[index] = newResponse;
      setResponse(updatedResponses);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const topic = promptText;

    try {
      const topicData = await addTopic({
        variables: { userId, topic },
      });

      const savedTopicId = topicData.data.addTopic.savedTopics[0].topic._id;
      console.log("here's the topic data: ", topicData);
      setTopicId(savedTopicId);
      console.log("This is my saved topid Id, ", savedTopicId);

      for (let i = 0; i < responses.length; i++) {
        try {
          console.log("This is my saved topid Id, ", savedTopicId);
          console.log("this is my response[i], ", responses[i]);
          console.log("this is my imageURLs[i], ", imageURLs[i]);

          await addResponse({
            variables: {
              topicId: savedTopicId,
              responseText: responses[i],
              imageURL: imageURLs[i],
            },
          });
        } catch (responseError) {
          console.error(`Error adding response at index ${i}:`, responseError);
        }
      }
      setResponse("");
    } catch (topicError) {
      console.error("Error adding topic:", topicError);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <button>Save Topic and Responses</button>
      <div className="prompt-text">
        Prompt Text:
        <span>{promptText}</span>
      </div>
      {responses.map((response, index) => (
        <div className="responseButton" key={index}>
          <div id={`button-${index}`}>
            <div>
              <p>
                {response}
                <button onClick={(event) => fetchCustomImage(event, index)}>
                  edit
                </button>
              </p>
            </div>
            <img src={imageURLs[index]} alt={`Response Image ${index}`} />
          </div>
        </div>
      ))}
      <div>
        <button onClick={fetchCustomImage}>Add Your Own Response</button>
      </div>
    </form>
  );
};

export default BigResponse;
