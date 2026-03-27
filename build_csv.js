const fs = require('fs');

// --- 1. Parse prospect data ---
const prospectData = fs.readFileSync('./linkedin_prospect_data.md', 'utf8');

const prospectBlocks = prospectData.split(/^### \d+\.\s*/m).slice(1);
const prospectHeaders = [...prospectData.matchAll(/^### \d+\.\s*(.+)/gm)];

const prospects = prospectHeaders.map((h, i) => {
  const block = prospectBlocks[i];
  const name = h[1].trim();

  const get = (label) => {
    // Handle compound fields like "Review title": X | "Review company": Y
    const regex = new RegExp(`\\*\\*${label}\\*\\*:\\s*(.+?)(?:\\s*\\|\\s*\\*\\*|$)`, 'm');
    const match = block.match(regex);
    return match ? match[1].trim() : '';
  };

  const source = get('Source');
  const reviewTitle = get('Review title');
  const reviewCompany = get('Review company');
  const currentTitle = get('Current title');
  const currentCompany = get('Current company');
  const location = get('Location');
  const linkedinUrl = get('LinkedIn URL');
  const notes = get('Notes');

  return { name, source, reviewTitle, reviewCompany, currentTitle, currentCompany, location, linkedinUrl, notes };
});

console.log(`Parsed ${prospects.length} prospects`);

// --- 2. Parse review files ---
function parseReviews(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const reviews = new Map();

  // Split by ### number.
  const blocks = content.split(/^### (\d+)\.\s*/m);
  // blocks: [preamble, num1, content1, num2, content2, ...]
  for (let i = 1; i < blocks.length; i += 2) {
    const num = parseInt(blocks[i]);
    let text = blocks[i + 1] || '';

    // For scratchpad/momentum: format is "Name | Title | Company\n"review text""
    // For rattle: format is "Name | Title | Company\n**Case study:** ..."
    // Extract the full block up to the next ### or end
    text = text.split(/\n### /)[0].trim();

    reviews.set(num, text);
  }

  return reviews;
}

// Also build a name-based index for unnumbered lookups
function buildNameIndex(reviewMap) {
  const nameIndex = new Map();
  for (const [num, text] of reviewMap) {
    // First line usually has the name
    const firstLine = text.split('\n')[0];
    const nameMatch = firstLine.match(/^(.+?)\s*\|/);
    if (nameMatch) {
      const name = nameMatch[1].trim().toLowerCase();
      nameIndex.set(name, { num, text });
    }
  }
  return nameIndex;
}

const scratchpadReviews = parseReviews('./scratchpad_reviews_full.md');
const momentumReviews = parseReviews('./momentum_reviews_full.md');
const rattleReviews = parseReviews('./rattle_reviews_full.md');

let superedReviews = new Map();
try {
  superedReviews = parseReviews('./supered_reviews_full.md');
} catch (e) { /* ok if missing */ }

const scratchpadNames = buildNameIndex(scratchpadReviews);
const momentumNames = buildNameIndex(momentumReviews);
const rattleNames = buildNameIndex(rattleReviews);

console.log(`Reviews loaded: Scratchpad=${scratchpadReviews.size}, Momentum=${momentumReviews.size}, Rattle=${rattleReviews.size}, Supered=${superedReviews.size}`);

// --- 3. Match reviews to prospects ---
function findReview(source, prospectName) {
  // Parse source like "Scratchpad review #123" or "Momentum testimonial #5" or "Rattle case study #15"
  const numMatch = source.match(/#(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : null;

  let reviewText = '';

  if (source.toLowerCase().includes('scratchpad')) {
    if (num && scratchpadReviews.has(num)) {
      reviewText = scratchpadReviews.get(num);
    } else {
      // Try name match for unnumbered
      const nameKey = prospectName.toLowerCase().split(' ')[0]; // first name
      for (const [name, data] of scratchpadNames) {
        if (name.includes(nameKey) || prospectName.toLowerCase().includes(name.split(' ')[0])) {
          reviewText = data.text;
          break;
        }
      }
    }
  } else if (source.toLowerCase().includes('momentum')) {
    if (num && momentumReviews.has(num)) {
      reviewText = momentumReviews.get(num);
    } else {
      const nameKey = prospectName.toLowerCase().split(' ')[0];
      for (const [name, data] of momentumNames) {
        if (name.includes(nameKey) || prospectName.toLowerCase().includes(name.split(' ')[0])) {
          reviewText = data.text;
          break;
        }
      }
    }
  } else if (source.toLowerCase().includes('rattle')) {
    if (num && rattleReviews.has(num)) {
      reviewText = rattleReviews.get(num);
    } else {
      const nameKey = prospectName.toLowerCase().split(' ')[0];
      for (const [name, data] of rattleNames) {
        if (name.includes(nameKey) || prospectName.toLowerCase().includes(name.split(' ')[0])) {
          reviewText = data.text;
          break;
        }
      }
    }
  } else if (source.toLowerCase().includes('supered')) {
    if (num && superedReviews.has(num)) {
      reviewText = superedReviews.get(num);
    }
  }

  // Clean: extract just the quote text if possible, remove the "Name | Title | Company" header line
  if (reviewText) {
    const lines = reviewText.split('\n');
    // First line is typically "Name | Title | Company" — skip it
    const rest = lines.slice(1).join('\n').trim();
    // If it starts with a quote mark, great. Otherwise return the whole thing minus header
    return rest || reviewText;
  }

  return '';
}

// --- 4. Build CSV ---
function escapeCSV(val) {
  if (!val) return '';
  // If contains comma, quote, or newline, wrap in quotes and escape inner quotes
  if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

const headers = [
  'Number',
  'Name',
  'Source',
  'Review Title',
  'Review Company',
  'Current Title',
  'Current Company',
  'Location',
  'LinkedIn URL',
  'Notes',
  'Review Text'
];

const rows = [headers.map(escapeCSV).join(',')];

let matched = 0;
let unmatched = 0;

prospects.forEach((p, idx) => {
  const review = findReview(p.source, p.name);
  if (review) matched++;
  else unmatched++;

  const row = [
    idx + 1,
    p.name,
    p.source,
    p.reviewTitle,
    p.reviewCompany,
    p.currentTitle,
    p.currentCompany,
    p.location,
    p.linkedinUrl,
    p.notes,
    review
  ].map(v => escapeCSV(String(v)));

  rows.push(row.join(','));
});

const csv = rows.join('\n');
fs.writeFileSync('./linkedin_prospects.csv', csv, 'utf8');

console.log(`\nCSV written to linkedin_prospects.csv`);
console.log(`${prospects.length} prospects, ${matched} reviews matched, ${unmatched} without review text`);
