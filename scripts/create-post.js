const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const moment = require("moment");

// Set the post directory and filename format
const POST_DIR = path.join(__dirname, "../posts");
const FILENAME_FORMAT = "YYYY-MM-DD";

// Prompt the user for a post title
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Enter a post title: ", (title) => {
  // Convert the title to a filename-friendly slug
  const slug = slugify(title, { lower: true });

  // Get the current date and time in the desired format
  const now = moment().format(FILENAME_FORMAT);

  // Generate the post template with the current date and time
  const template = `---
title: "${title}"
date: "${now}"
tags: []
desc: ""
---

`;

  // Create the new post file with the generated template
  const filename = `${slug}.md`;
  const filepath = path.join(POST_DIR, filename);
  fs.writeFile(filepath, template, (err) => {
    if (err) throw err;
    console.log(`New post created: ${filename}`);
  });

  // Close the readline interface
  readline.close();
});
