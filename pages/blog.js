import Layout from "@/components/Layout";
import Title from "@/components/Title";
import ListLayout from "@/components/ListLayout";
import config from "@/data/config";
import { getAllPublished } from "@/lib/notion";

export const getServerSideProps = async () => {
  const POSTS_PER_PAGE = 5;
  const posts = await getAllPublished();
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return { props: { initialDisplayPosts, posts, pagination } };
};

export default function blog({ posts, initialDisplayPosts, pagination }) {
  return (
    <Layout
      title={config.page.blog.header}
      description={`${config.page.blog.title} - ${config.page.blog.title}`}
    >
      <Title
        title={config.page.blog.title}
        subtitle={config.page.blog.subtitle}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </Layout>
  );
}
