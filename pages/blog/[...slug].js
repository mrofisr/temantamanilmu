import fs from "fs";
import { MDXLayoutRenderer } from "@/components/MDXComponents";
import generateRss from "@/lib/generate-rss";
import { getAllPublished, getSingleBlogPostBySlug } from "@/lib/notion";

export async function getStaticPaths() {
  const posts = await getAllPublished();
  return {
    paths: posts.map((p) => ({
      params: {
        slug: [p.slug], // wrap the slug in an array
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllPublished();
  const postIndex = allPosts.findIndex((post) => post.slug === params.slug[0]); // access the first element of the slug array
  const prev = allPosts[postIndex + 1] || null;
  const next = allPosts[postIndex - 1] || null;
  const post = await getSingleBlogPostBySlug(params.slug[0]); // access the first element of the slug array
  // rss
  const rss = generateRss(allPosts);
  fs.writeFileSync("./public/feed.xml", rss);
  return { props: { post, prev, next } };
}

export default function Blog({ post, prev, next }) {
  const { markdown, metadata } = post;
  return (
    <>
      <MDXLayoutRenderer
        mdxSource={markdown}
        frontMatter={metadata}
        prev={prev}
        next={next}
      />
    </>
  );
}
