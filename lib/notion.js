const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getAllPublished = async () => {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });
  const allPosts = posts.results;
  return allPosts.map((post) => {
    return getPageMetaData(post);
  });
};

const getPageMetaData = (post) => {
  const getTags = (tags) => {
    const allTags = tags.map((tag) => {
      return tag.name;
    });
    return allTags;
  };
  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select),
    description: post.properties.Description.rich_text[0].plain_text,
    date: getToday(post.properties.Date.date.start),
    slug: post.properties.Slug.rich_text[0].plain_text,
  };
};

function getToday(datestring) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  let date = new Date();
  if (datestring) {
    date = new Date(datestring);
  }

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let today = `${month} ${day}, ${year}`;

  return today;
}

export const getAllTags = async () => {
  const posts = await getAllPublished();

  const tags = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tags[tag]) {
        tags[tag] = 1;
      } else {
        tags[tag]++;
      }
    });
  });

  return tags;
};

const { NotionToMarkdown } = require("notion-to-md");
const n2m = new NotionToMarkdown({ notionClient: notion });

export const getSingleBlogPostBySlug = async (slug) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  const page = response.results[0];
  const metadata = getPageMetaData(page);
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);
  return {
    metadata,
    markdown: mdString,
  };
};
