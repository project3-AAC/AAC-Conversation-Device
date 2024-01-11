const { User, Topic, Response } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId }).populate({
        path: "savedTopics.topic",
        model: "Topic",
        populate: {
          path: "responses",
          model: "Response",
        },
      });
    },

    me: async (parent, args, context) => {
      console.log("context, ", context.user);
      if (context.user) {
        console.log("this be my context", context.user);
        return User.findOne({ _id: context.user._id }).populate({
          path: "savedTopics.topic",
          model: "Topic",
          populate: {
            path: "responses",
            model: "Response",
          },
        });
      }
      throw AuthenticationError;
    },
    topics: async () => {
      return Topic.find();
    },

    topic: async (parent, { topicId }) => {
      return Topic.findOne({ _id: topicId }).populate("responses");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    removeUser: async (parent, { userId }) => {
      return User.findOneAndDelete({ _id: userId });
    },

    addTopic: async (parent, { userId, topic }, context) => {
      try {
        const newTopic = await Topic.create({ promptText: topic });
        console.log("Here's the newTopic");
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              savedTopics: {
                $each: [{ topic: newTopic._id }],
                $position: 0,
              },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate("savedTopics.topic");

        console.log("updated user: ", updatedUser);
        return updatedUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to add topic to user");
      }
    },
    editTopic: async (parent, { topicId, promptText }, context) => {
      try {
        const updatedTopic = await Topic.findByIdAndUpdate(
          topicId,
          { $set: { promptText } },
          { new: true }
        );
        console.log("heres my updated topic!: ", updatedTopic);
        return updatedTopic;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to edit topic");
      }
    },
    removeTopic: async (parent, { topicId }, context) => {
      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedTopics: { topic: topicId } } },
        { new: true }
      );
    },
    addResponse: async (
      parent,
      { topicId, responseText, imageURL },
      context
    ) => {
      try {
        const newResponse = await Response.create({
          topicId: topicId,
          responseText: responseText,
          imageURL: imageURL,
        });
        console.log("Here's the new response, ", newResponse);
        const updatedTopic = await Topic.findByIdAndUpdate(
          topicId,
          {
            $addToSet: { responses: newResponse._id },
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate("responses");
        console.log("Here's the updated topic, ", updatedTopic);

        return updatedTopic;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to add response to Topic");
      }
    },
    editResponse: async (parent, { responseId, responseText }, context) => {
      try {
        const updatedResponse = await Response.findByIdAndUpdate(
          responseId,
          { $set: { responseText } },
          { new: true }
        );
        console.log("heres my updated response!: ", updatedResponse);
        return updatedResponse;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to edit response");
      }
    },
    removeResponse: async (parent, { responseId }, context) => {
      return Topic.findOneAndUpdate(
        { _id: topicId },
        { $pull: { responses: responseId } },
        { new: true }
      );
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
