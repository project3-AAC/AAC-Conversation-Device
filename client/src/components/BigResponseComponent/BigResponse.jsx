import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  ADD_TOPIC,
  ADD_RESPONSE,
  REMOVE_TOPIC,
} from "../../../utils/mutations";

import "./BigResponse.scss";
import Button from "react-bootstrap/Button";
import Auth from "../../../utils/auth";
import EditModal from "../EditModal/EditModal";
// import { QUERY_SINGLE_TOPIC } from "../../../utils/queries";
import { Link } from "react-router-dom";

export default function BigResponse({
  userId,
  promptText,
  responses,
  imageURLs,
  isFetchedAnswers,
  addCustomResponse,
}) {
  const [addTopic, { error: topicError }] = useMutation(ADD_TOPIC);
  const [removeTopic, { error }] = useMutation(REMOVE_TOPIC);
  const [addResponse, { error: responseError }] = useMutation(ADD_RESPONSE);
  const [savedTopic, setSavedTopic] = useState(false);
  const [removedTopic, setRemovedtopic] = useState(false);
  const [topicId, setTopicId] = useState(null);
  const [responseIds, setResponseIds] = useState([]);
  const [response, setResponse] = useState("");

  // Function that is called to make an element read out loud.
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleRemoveTopic = async (topicId) => {
    try {
      const { data } = await removeTopic({
        variables: { topicId },
      });
      // Resetting states
      setRemovedtopic(true);
      setTopicId(null);
      setResponse("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Checks if topic has already been removed
    if (removedTopic) {
      return;
    }

    const topic = promptText;

    // Saves the topic to database
    try {
      const topicData = await addTopic({
        variables: { userId, topic },
      });

      const savedTopicId = topicData.data.addTopic.savedTopics[0].topic._id;
      setTopicId(savedTopicId);

      // Saves the responses attached to the topic to database
      for (let i = 0; i < responses.length; i++) {
        try {
          const responseMutationResult = await addResponse({
            variables: {
              topicId: savedTopicId,
              responseText: responses[i],
              imageURL: imageURLs[i],
            },
          });

          const addedResponseId =
            responseMutationResult.data.addResponse.responses[i]._id;
          setResponseIds((prevResponseIds) => [
            ...prevResponseIds,
            addedResponseId,
          ]);
          setSavedTopic(true);
        } catch (responseError) {
          console.error(`Error adding response at index ${i}:`, responseError);
        }
      }
    } catch (topicError) {
      console.error("Error adding topic: ", topicError);
    }
  };

  console.log("This is the type of my responses, ", typeof responses);

  const savedResponse = savedTopic
    ? { background: "darkseagreen" }
    : { background: "white" };

  return removedTopic ? (
    <></>
  ) : (
    <>
      <form onSubmit={handleFormSubmit}>
        {Auth.loggedIn() && isFetchedAnswers ? (
          <div className="saveButtonContainer">
            {savedTopic ? (
              <Button
                className="saveTopic saveTopicBtn"
                variant="secondary"
                size="sm"
                type="submit"
                style={savedResponse}
              >
                Topic Saved!
              </Button>
            ) : (
              <Button
                className="saveTopic saveTopicBtn"
                variant="secondary"
                size="sm"
                type="submit"
              >
                Save Topic and Responses
              </Button>
            )}

            <div className="prompt-text-container">
              <div className="prompt-text">
                <span>{promptText}</span>
                {savedTopic ? (
                  <div>
                    <Button
                      className="removeTopicButton"
                      onClick={() => handleRemoveTopic(topicId)}
                    >
                      Remove Topic and Responses
                    </Button>
                    <Link to={`/${topicId}`}>
                      <Button className="editTopicButton">Edit Topic</Button>
                    </Link>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        ) : isFetchedAnswers ? (
          <div className="loginPrompt">
            Login to save and customize responses!
          </div>
        ) : (
          <></>
        )}
        {isFetchedAnswers && !savedTopic ? (
          <EditModal
            className="responseButton"
            addCustomResponse={addCustomResponse}
            savedTopic={savedTopic}
          />
        ) : (
          <></>
        )}

        {responses.map((response, index) => (
          <div
            key={index}
            onClick={() => speak(response)}
            className="responseButton"
            style={savedResponse}
          >
            <div style={{ width: "20rem" }} id={`button-${index}`}>
              <div>
                <div>{response}</div>
              </div>
              <img src={imageURLs[index]} alt={`Response Image ${index}`} />
            </div>
          </div>
        ))}
      </form>
    </>
  );
}
