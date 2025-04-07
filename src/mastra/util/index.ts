const PDFDocument = require("pdfkit");
// Assuming SimplifiedRedditPostSchema is defined elsewhere correctly
// import { SimplifiedRedditPostSchema } from "@root/src/main";
import fs from "fs"; // Use standard fs for createWriteStream
import { z } from "zod";

// Placeholder for the actual schema if you need type checking here
// Replace with your actual import if running this standalone
const SimplifiedRedditPostSchema = z.object({
  title: z.string(),
  authorName: z.string(),
  authorId: z.string(),
  authorUrl: z.string(), // Still keeping it in the data structure
  creationDate: z.string(), // Assuming date is already formatted as string
  contentText: z.string(),
});

export function savePostsToPDF(
  posts: z.infer<typeof SimplifiedRedditPostSchema>[],
  filename: string
): Promise<void> {
  // Return a Promise to handle the asynchronous nature of file writing
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Create a writable stream
    const stream = fs.createWriteStream(filename);

    // Pipe the PDF output to the stream
    doc.pipe(stream);

    // --- PDF Content Generation ---

    // Add header
    doc.fontSize(24).text("Reddit Posts", { align: "center" }).moveDown(2); // Added more space

    posts.forEach((post, index) => {
      // Title
      doc.fontSize(18).text(post.title, { paragraphGap: 5 }); // Use paragraphGap for spacing after

      // Author Info (simplified - no link)
      doc.fontSize(10); // Smaller font for meta info
      doc.text(`Author: ${post.authorName} (ID: ${post.authorId})`);
      // Optionally display the URL as plain text if needed:
      // doc.text(`URL: ${post.authorUrl}`);
      doc.moveDown(0.5); // Smaller space

      // Date
      doc.text(`Posted on: ${post.creationDate}`);
      doc.moveDown(); // Default space before content

      // Content
      doc.fontSize(12).text(post.contentText, {
        align: "justify", // Justify text for better block appearance
        paragraphGap: 10, // Space after the content block
      });

      // Add a separator line *if* it's not the last post
      if (index < posts.length - 1) {
        doc
          .strokeColor("#aaaaaa") // Lighter gray
          .lineWidth(0.5)
          // Draw line respecting margins
          .moveTo(doc.page.margins.left, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .stroke()
          .moveDown(1.5); // More space after line
      }
    });

    // --- Finalize PDF ---

    // End the document stream
    doc.end();

    // Handle stream events
    stream.on("finish", () => {
      console.log(`PDF saved successfully to ${filename}`);
      resolve(); // Resolve the promise on successful write
    });

    stream.on("error", (err) => {
      console.error(`Error writing PDF to ${filename}:`, err);
      reject(err); // Reject the promise on error
    });
  });
}

// --- Example Usage (requires dummy data) ---
/*
const dummyPosts = [
  {
    title: "First Example Post",
    authorName: "UserOne",
    authorId: "u123",
    authorUrl: "http://example.com/userone",
    creationDate: "2025-04-07",
    contentText: "This is the content of the first post. It should wrap nicely within the PDF margins. We are testing the justification and spacing as well."
  },
  {
    title: "Another Post Title",
    authorName: "UserTwo",
    authorId: "u456",
    authorUrl: "http://example.com/usertwo",
    creationDate: "2025-04-06",
    contentText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }
];

savePostsToPDF(dummyPosts, 'reddit_posts.pdf')
  .then(() => console.log('PDF generation complete.'))
  .catch(err => console.error('PDF generation failed:', err));
*/
