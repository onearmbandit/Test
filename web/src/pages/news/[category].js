import axios from "axios";
import Link from "next/link";

export default function ArticleListByCategory({ category, articles }) {
  if (!articles.length)
    return (
      <>
        <h1>
          Category <q>{category}</q> does not exist
        </h1>
        <Link href="/news">Back</Link>
      </>
    );
  const articlesList = articles.map((article) => (
    <article key={article.id}>
      <h1>title: {article.title}</h1>
      <h3>category: {article.category}</h3>
      <p>description: {article.description}</p>
      <hr />
    </article>
  ));
  return (
    <>
      <h1>Articles for {category}</h1>
      {articlesList}
    </>
  );
}
// SSR
export async function getServerSideProps(context) {
  const { params } = context;
  const { category } = params;
  const response = await axios.get(
    `http://localhost:4000/news?category=${category}`
  );
  const data = await response.data;

  // render 404 if undefined
  if (!data.length) {
    return {
      notFound: true,
    };
  }

  // return an obj with contains props obj for component
  return {
    props: {
      category,
      articles: data,
    },
  };
}
