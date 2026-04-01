const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

const filePath = './linkedin_prospects.csv';
const content = fs.readFileSync(filePath, 'utf8');

const records = parse(content, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
});

console.log(`Parsed ${records.length} rows`);

const updated = records.map(row => {
  const name = row['Name'] || '';
  // Split by space, skip initials like "B."
  const parts = name.split(' ').filter(p => p.length > 2 || !p.includes('.'));
  const firstName = parts[0] || name.split(' ')[0];
  return { ...row, 'First Name': firstName };
});

const csv = stringify(updated, { header: true });
fs.writeFileSync(filePath, csv, 'utf8');
console.log(`Done. Wrote ${updated.length} rows with First Name column.`);

// Verify a few
const sample = updated.slice(0, 5).map(r => `${r['Name']} -> ${r['First Name']}`);
console.log('\nSample:');
sample.forEach(s => console.log(`  ${s}`));
