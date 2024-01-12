import { useQuery } from "@apollo/client";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import RecordButton from "../components/RecordButton/RecordButton";
import SavedTopics from "../components/SavedTopics/SavedTopics";
import { QUERY_ME } from "../../utils/queries";
const Home = () => {
  const { loading, data } = useQuery(QUERY_ME);
  console.log(data);
  const username = data?.me.username;
  const topics = data?.me.savedTopics;

  return (
    <main>
      <div>
        <Header />
        <Navbar />
        <RecordButton />
        <SavedTopics username={username} topics={topics} />
      </div>
    </main>
  );
};

export default Home;
