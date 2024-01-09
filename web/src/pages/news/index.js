import axios from "axios";
import Link from "next/link";

export default function ListOfNews({ news }) {
  const listOfNews = news.map((n) => (
    <article key={n.id}>
      <h1>title: {n.title}</h1>
      <h3>category: {n.category}</h3>
      <p>description: {n.description}</p>
      <hr />
    </article>
  ));
  return (
    <>
      <h1>List of News</h1>
      <span>categories:</span>
      <nav>
        <Link href="/news/sport">sport</Link>{" "}
        <Link href="/news/entertainment">entertainment</Link>{" "}
        <Link href="/news/finance">finance</Link>{" "}
        <Link href="/news/politics">politics</Link>
      </nav>
      {listOfNews}
    </>
  );
}

// SSR
export async function getServerSideProps() {
  const response = await axios.get("http://localhost:4000/news");
  const data = await response.data;

  // render 404 page if undefined
  if (!data) {
    return {
      notFound: true,
    };
  }

  // return an obj with contains props obj for component
  return {
    props: {
      news: data,
    },
  };
}
