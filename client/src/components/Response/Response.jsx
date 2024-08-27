import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDoneOutline } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { EDIT_RESPONSE } from "../../../utils/mutations";

import axios from "axios";

export default function Response({ response, imageURL, savedTopic }) {
  const [customResponse, setCustomResponse] = useState(response);
  const [customImageURL, setCustomImageURL] = useState(imageURL);
  const [imageSearchTerm, setImageSearchTerm] = useState();
  const [possibleImageURLs, setPossibleImageURLs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editResponse, { error: editResponseError }] =
    useMutation(EDIT_RESPONSE);

  const toggleEditMode = (e) => {
    e.preventDefault();
    setEditMode(!editMode);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const fetchCustomImageOptions = async () => {
    try {
      const imageData = await axios.post(
        `https://ai-aac-db2.onrender.com/api/fetchCustomImages`,
        {
          searchTerm: imageSearchTerm,
        }
      );

      const newImages = imageData.data.photos;
      setPossibleImageURLs(newImages);
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };

  const handleSelectImage = (url) => {
    setCustomImageURL(url);
    setEditMode(!editMode);
    setImageSearchTerm("");
    setPossibleImageURLs([]);
  };

  const editResponseFunction = async (
    responseId,
    customResponse,
    customImageURL
  ) => {
    try {
      const editResponseResult = await editResponse({
        variables: {
          responseId: responseId,
          responseText: customResponse,
          imageURL: customImageURL,
        },
      });
    } catch (editResponseError) {
      console.error("Error editing response", editResponseError);
    }
  };

  const savedResponse = savedTopic
    ? { background: "darkseagreen" }
    : { background: "white" };

  return (
    <>
      {editMode ? (
        <>
          <input
            placeholder="Enter custom response text"
            onChange={(e) => setCustomResponse(e.target.value)}
          />
          <input
            placeholder="Enter search term for custom image"
            onChange={(e) => setImageSearchTerm(e.target.value)}
          />
          <button onClick={fetchCustomImageOptions}>Search Images</button>
          <img src={customImageURL}></img>

          {savedTopic ? (
            <>
              {possibleImageURLs.map((possibleImage) => (
                <div
                  key={possibleImage.id}
                  onClick={() =>
                    editResponseFunction(
                      responseId,
                      customResponse,
                      possibleImage.src.medium
                    )
                  }
                >
                  <img
                    className="possibleImage"
                    src={possibleImage.src.medium}
                  ></img>
                  <div className="imageOverlay">Select Image</div>
                </div>
              ))}
            </>
          ) : (
            <>
              {possibleImageURLs.map((possibleImage) => (
                <div
                  className="possibleImageContainer"
                  key={possibleImage.id}
                  onClick={() => handleSelectImage(possibleImage.src.medium)}
                >
                  <img
                    className="possibleImage"
                    src={possibleImage.src.medium}
                  ></img>
                  <div className="imageOverlay">Select Image</div>
                </div>
              ))}
            </>
          )}

          {possibleImageURLs.map((possibleImage) => (
            <div
              className="possibleImageContainer"
              key={possibleImage.id}
              onClick={() => handleSelectImage(possibleImage.src.medium)}
            >
              <img
                className="possibleImage"
                src={possibleImage.src.medium}
              ></img>
              <div className="imageOverlay">Select Image</div>
            </div>
          ))}
          <MdDoneOutline onClick={(e) => toggleEditMode(e)} />
        </>
      ) : (
        <div
          style={savedResponse}
          onClick={() => speak(response)}
          className="flex flex-col items-center"
        >
          <h6 className="bg-purple-500">
            {customResponse}
            <span>
              <FaEdit onClick={(e) => toggleEditMode(e)} />
            </span>
          </h6>
          <img src={customImageURL}></img>
        </div>
      )}
    </>
  );
}
