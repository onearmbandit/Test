import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/post">Products</Link> <Link href="/news">News</Link>
    </main>
  );
}
