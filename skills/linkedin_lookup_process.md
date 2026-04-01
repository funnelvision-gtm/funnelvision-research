# LinkedIn Sales Navigator Lookup Process

## How to look up a prospect

1. Navigate to Sales Nav search via URL: `https://www.linkedin.com/sales/search/people?query=(keywords%3A[First]%2520[Last]%2520[Company])`
   - URL-encode spaces as `%2520`
   - e.g. `keywords%3AScott%2520Kiever%2520Amino`
   - If no results, try without company name, or try with role keyword (e.g. "RevOps") instead
2. Wait 2 seconds for results to load
3. From the search result listitem, capture:
   - Current title
   - Current company
   - Location
   - Time in role / time in company
   - Previous experience snippet (if shown)
4. Click the person's **name link** in the search result — this opens a **side panel** (NOT a new page)
5. Wait 2 seconds for side panel to load
6. In the side panel, find the button with `aria-label="Open actions overflow menu"` (the "..." button)
   - Use: `find "Open actions overflow menu button"` — pick the **second** result (ref for details panel)
7. Click that button — a dropdown appears with: Connect, **View LinkedIn profile**, Copy LinkedIn.com URL
8. Use: `find "View LinkedIn profile link"` — read the **href** attribute which gives the `linkedin.com/in/username` URL
9. **Write the entry to `linkedin_prospect_data.md` BEFORE moving to the next person**
10. Navigate to the next search URL

## Tips
- If search returns 0 results with company name, try without it or with a role keyword
- The side panel overflow menu (step 6) has TWO "Open actions overflow menu" buttons — use the **second** one (the details panel one)
- Always write to the data file before moving on — if the session is interrupted, no data is lost

## Data to capture for each person

- **Source**: Which competitor review file and review number
- **Review title**: Their title when they wrote the review
- **Review company**: The company they were at when they wrote the review
- **Current title**: Where they are now on LinkedIn
- **Current company**: Their current employer
- **Location**: City, State/Country
- **LinkedIn URL**: The `linkedin.com/in/username` URL from the "View LinkedIn profile" href
- **Notes**: Job changes, tenure, connections, anything notable

## Tracking format in linkedin_prospect_data.md

```
### [Number]. [Full Name]
- **Source**: [Competitor] review #[number]
- **Review title**: [title] | **Review company**: [company]
- **Current title**: [title] | **Current company**: [company]
- **Location**: [location]
- **LinkedIn URL**: [url]
- **Notes**: [notes]
```
