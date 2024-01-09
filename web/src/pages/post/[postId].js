import { useRouter } from "next/router";

export default function ProductDetails({ post }) {
  const router = useRouter();

  // if current page is in fallback mode
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <h4>Title: {post.title}</h4>
      <p>Description: {post.body}</p>
    </>
  );
}

// static paths for dynamic SSG
export async function getStaticPaths() {
  return {
    paths: [
      {
        params: { postId: "1" },
      },
      {
        params: { postId: "2" },
      },
    ],
    fallback: true, // page mode
  };
}

// dynamic SSG
export async function getStaticProps(context) {
  const { params } = context;
  const { postId } = params;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  const data = await response.json();

  // render 404 if not found
  if (!data.id) {
    return {
      notFound: true,
    };
  }

  // return props obj
  return {
    props: {
      post: data,
    },
    revalidate: 5,
  };
}
