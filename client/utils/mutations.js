import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_TOPIC = gql`
  mutation Mutation($userId: ID!, $topic: String!) {
    addTopic(userId: $userId, topic: $topic) {
      savedTopics {
        topic {
          promptText
          _id
          responses {
            _id
            responseText
            imageURL
          }
        }
      }
    }
  }
`;

// export const ADD_TOPIC = gql`
//   mutation Mutation($userId: ID!, $topic: String!) {
//     addTopic(userId: $userId, topic: $topic) {
//       savedTopics {
//         topic {
//           promptText
//           responses {
//             _id
//             responseText
//             imageURL
//           }
//         }
//       }
//     }
//   }
// `;

// export const ADD_RESPONSE = gql`
//   mutation Mutation($topicId: ID!, $responseText: String, $imageURL: String) {
//     addResponse(
//       topicId: $topicId
//       responseText: $responseText
//       imageURL: $imageURL
//     ) {
//       _id
//     }
//   }
// `;

export const ADD_RESPONSE = gql`
  mutation Mutation($topicId: ID!, $responseText: String, $imageURL: String) {
    addResponse(
      topicId: $topicId
      responseText: $responseText
      imageURL: $imageURL
    ) {
      _id
      responses {
        _id
      }
    }
  }
`;

export const EDIT_RESPONSE = gql`
  mutation Mutation(
    $responseId: ID!
    $responseText: String
    $imageUrl: String
  ) {
    editResponse(
      responseId: $responseId
      responseText: $responseText
      imageURL: $imageUrl
    ) {
      promptText
      _id
      responses {
        responseText
      }
    }
  }
`;

export const REMOVE_TOPIC = gql`
  mutation Mutation($topicId: ID!) {
    removeTopic(topicId: $topicId) {
      _id
      savedTopics {
        topic {
          _id
        }
      }
    }
  }
`;

export const REMOVE_RESPONSE = gql`
  mutation Mutation($topicId: ID!, $responseId: ID!) {
    removeResponse(topicId: $topicId, responseId: $responseId) {
      _id
      promptText
      responses {
        _id
        responseText
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
