import fs from "fs";
import { MDXLayoutRenderer } from "@/components/MDXComponents";
import {
  formatSlug,
  getFiles,
} from "@/lib/mdx";
import generateRss from "@/lib/generate-rss";
import { getAllPublished, getSingleBlogPostBySlug } from "@/lib/notion";

export async function getStaticPaths() {
  const posts = getFiles("posts");
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split("/"),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllPublished();
  const postIndex = allPosts.findIndex(
    (post) => formatSlug(post.slug) === params.slug
  );
  const prev = allPosts[postIndex + 1] || null;
  const next = allPosts[postIndex - 1] || null;
  const post = await getSingleBlogPostBySlug(params.slug);
  // rss
  const rss = generateRss(allPosts);
  fs.writeFileSync("./public/feed.xml", rss);

  return { props: { post, prev, next } };
}

export default function Blog({ post, prev, next }) {
  const { mdxSource, frontMatter } = post;

  return (
    <>
      <MDXLayoutRenderer
        mdxSource={mdxSource}
        frontMatter={frontMatter}
        prev={prev}
        next={next}
      />
    </>
  );
}
