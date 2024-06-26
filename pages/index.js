import Layout from "@/components/Layout";
import Title from "@/components/Title";
import Link from "next/dist/client/link";
import Tag from "@/components/Tag";
import config from "@/data/config";
import { getAllPublished } from "@/lib/notion";

export const getServerSideProps = async () => {
  const notion = await getAllPublished();
  return {
    props: {
      notion,
    },
  };
};

export default function index({ notion }) {
  const MAX_DISPLAY = 5;
  return (
    <Layout
      title={config.page.index.header}
      description={`${config.page.index.title} - ${config.page.index.subtitle}`}
    >
      <Title
        title={config.page.index.title}
        subtitle={config.page.index.subtitle}
      />
      <ul className="divide-y divide-gray-400 md:divide-y-1 dark:divide-white">
        {notion?.length === 0
          ? Array.from({ length: MAX_DISPLAY }).map((_, i) => (
              <li key={i} className="py-4">
                <article className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-400 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-5/6"></div>
                  </div>
                </article>
              </li>
            ))
          : notion?.slice(0, MAX_DISPLAY).map((frontMatter) => {
              const { slug, date, title, description, tags } = frontMatter;
              return (
                <li key={slug} className="py-4">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{date}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl text-yellow-600 dark:text-yellow-400 font-bold leading-8 tracking-tight capitalize">
                              <Link href={`/blog/${slug}`}>{title}</Link>
                            </h2>
                            <div className="flex flex-wrap mt-1">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose text-gray-500 max-w-none dark:text-gray-400">
                            {description}
                          </div>
                        </div>
                        <div className="text-base font-medium leading-6 dark:text-white">
                          <Link
                            href={`/blog/${slug}`}
                            aria-label={`Read "${title}"`}
                          >
                            Read more
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
      </ul>
      {notion?.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6 dark:text-white">
          <Link href="/blog" aria-label="all posts">
            All Posts &rarr;
          </Link>
        </div>
      )}
    </Layout>
  );
}
