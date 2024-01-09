import axios from "axios";
import Post from "@/components/post";

export default function PostList({ data }) {
  return <Post posts={data} />;
}

// SSG
export async function getStaticProps() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  const posts = await response.data;

  return {
    props: {
      data: posts,
    },
  };
}
