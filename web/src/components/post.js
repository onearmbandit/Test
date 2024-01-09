import Link from "next/link";

export default function Post({ posts }) {
  return posts.map((post) => (
    <article key={post.id}>
      <Link href={`/post/${post.id}`}>
        <h1>Title: {post.title}</h1>
      </Link>
    </article>
  ));
}
