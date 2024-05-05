import fs from "fs";
import generateRss from "@/lib/generate-rss";
import { getAllPublished, getSingleBlogPostBySlug } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Layout from "@/components/Layout";
import Link from "next/link";

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus} PreTag="div">
      {value}
    </SyntaxHighlighter>
  );
};

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
  const { metadata, markdown } = post;
  const { slug, date, title, description } = metadata;
  return (
    <>
      <Layout
        title={`${title} - @temantamanilmu`}
        description={description}
        slug={slug}
      >
        <article className="min-h-screen py-12">
          <div>
            <header>
              <div className="space-y-1 text-center border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                  {title}
                </h1>
                <dl>
                  <div>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400 my-2">
                      <time dateTime={date}>{date}</time>
                    </dd>
                  </div>
                </dl>
              </div>
            </header>
            <div
              className="pb-8 divide-y divide-gray-200 xl:divide-y-0 dark:divide-gray-700 "
              style={{ gridTemplateRows: "auto 1fr" }}
            >
              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2 text-justify">
                <div className="pt-10 pb-8 prose dark:prose-dark max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <CodeBlock
                            codestring={String(children).replace(/\n$/, "")}
                            language={match[1]}
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
              <footer>
                <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                  {prev && (
                    <div className="pt-4 xl:pt-8 dark:text-white">
                      <Link
                        href={`/blog/${prev.slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <p>&larr; {prev.title}</p>
                      </Link>
                    </div>
                  )}
                  {next && (
                    <div className="pt-4 xl:pt-8 dark:text-white">
                      <Link
                        href={`/blog/${next.slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <p> {next.title} &rarr;</p>
                      </Link>
                    </div>
                  )}
                </div>
              </footer>
            </div>
          </div>
        </article>
      </Layout>
    </>
  );
}
