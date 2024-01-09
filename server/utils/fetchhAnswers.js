require('dotenv').config()
console.log(process.env)

const fetchAnswers = async () => {
    const openAIApiKey = process.env.API_KEY

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
        //  env.Photos_API_KEY
        "THj5EwzyfSVYW1UvgByttwmIlcqXDvRS8AmbWtx587POTV86qPqdfd30"
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

}

export default fetchAnswers