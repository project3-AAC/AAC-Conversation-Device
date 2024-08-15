import Response from "../Response/Response";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  ADD_TOPIC,
  ADD_RESPONSE,
  REMOVE_TOPIC,
} from "../../../utils/mutations";
import EditModal from "../EditModal/EditModal";

export default function ResponsesList({
  responses,
  imageURLs,
  promptText,
  userId,
  isFetchedAnswers,
  addCustomResponse,
}) {
  console.log("ResponsesList Responses, ", responses);
  console.log("ResponseList ImageURLs, ", imageURLs);
  const [removedTopic, setRemovedtopic] = useState(false);
  const [savedTopic, setSavedTopic] = useState(false);
  const [addTopic, { error: topicError }] = useMutation(ADD_TOPIC);
  const [removeTopic, { error: removeTopicError }] = useMutation(REMOVE_TOPIC);
  const [addResponse, { error: responseError }] = useMutation(ADD_RESPONSE);
  const [topicId, setTopicId] = useState(null);
  const [responseIds, setResponseIds] = useState([]);

  const responsesAndImages = responses.map((response, index) => ({
    response,
    imageURL: imageURLs[index],
  }));

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

  return (
    <>
      {isFetchedAnswers ? (
        <div>
          <h1>{promptText}</h1>
          <Button
            className="saveTopic saveTopicBtn"
            variant="secondary"
            size="sm"
            type="submit"
            onClick={handleFormSubmit}
          >
            Save Topic and Responses
          </Button>
          <EditModal addCustomResponse={addCustomResponse} />
          {responsesAndImages.map(({ response, imageURL }, index) => (
            <Response
              key={index}
              response={response}
              imageURL={imageURL}
              savedTopic={savedTopic}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
