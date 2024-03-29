import Layout from "@/components/Layout";
import Title from "@/components/Title";
import ListLayout from "@/components/ListLayout";
import { getAllPublished } from "@/lib/notion";
import config from "@/data/config";

export async function getStaticPaths() {
  const POSTS_PER_PAGE = 5;
  const totalPosts = await getAllPublished();
  const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const POSTS_PER_PAGE = 5;
  const {
    params: { page },
  } = context;
  const posts = await getAllPublished();
  const pageNumber = parseInt(page);
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return {
    props: {
      posts,
      initialDisplayPosts,
      pagination,
    },
  };
}

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
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
    </>
  );
}
