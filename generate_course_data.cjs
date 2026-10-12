const fs = require('fs');
const content = fs.readFileSync('src/data/courseData.js', 'utf8');

const match = content.match(/chapters: \[([\s\S]*?)\n  \],\n\};/);
if (!match) {
  console.log("Could not find chapters array");
  process.exit(1);
}

const chaptersText = match[1];

let grade7Text = chaptersText
  .replace(/ch1/g, 'ch4').replace(/Introduction to AI/g, 'Intermediate AI (Grade 7)')
  .replace(/ch2/g, 'ch5').replace(/Machine Learning Basics/g, 'Applied Machine Learning (Grade 7)')
  .replace(/ch3/g, 'ch6').replace(/Neural Networks/g, 'Advanced Neural Networks (Grade 7)');

let grade8Text = chaptersText
  .replace(/ch1/g, 'ch7').replace(/Introduction to AI/g, 'Advanced AI (Grade 8)')
  .replace(/ch2/g, 'ch8').replace(/Machine Learning Basics/g, 'Deep Learning (Grade 8)')
  .replace(/ch3/g, 'ch9').replace(/Neural Networks/g, 'AI Ethics & Future (Grade 8)');

let originalChaptersText = chaptersText
  .replace(/order: 1,/g, "order: 1,\n      grade: '6',")
  .replace(/order: 2,/g, "order: 2,\n      grade: '6',")
  .replace(/order: 3,/g, "order: 3,\n      grade: '6',");

grade7Text = grade7Text
  .replace(/order: 1,/g, "order: 1,\n      grade: '7',")
  .replace(/order: 2,/g, "order: 2,\n      grade: '7',")
  .replace(/order: 3,/g, "order: 3,\n      grade: '7',");

grade8Text = grade8Text
  .replace(/order: 1,/g, "order: 1,\n      grade: '8',")
  .replace(/order: 2,/g, "order: 2,\n      grade: '8',")
  .replace(/order: 3,/g, "order: 3,\n      grade: '8',");

const newChapters = originalChaptersText + ",\n" + grade7Text + ",\n" + grade8Text;
const newContent = content.replace(match[1], newChapters);

fs.writeFileSync('src/data/courseData.js', newContent);
console.log("Successfully generated Grade 7 and 8 chapters.");
