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

## Wave order (from competitor_reviewer_profiles.md)

### Wave 1 — RevOps Leaders (Marcus persona)
1. ~~Alex Kean — Director of Revenue Operations, Merge~~ DONE — still at Merge, promoted to Sr. Director
2. ~~Tarren Gill — RevOps Manager, Recharge~~ NOT FOUND on LinkedIn
3. ~~Feras Abdel — Sr. Director of RevOps, MaintainX~~ DONE — moved to BuildOps
4. ~~Navin Persaud — VP of RevOps, 1Password~~ DONE — still at 1Password
5. ~~Mark Turner — VP of RevOps, Demandbase~~ DONE — still at Demandbase
6. ~~Ryan Meeker — VP of RevOps, Bill.com~~ DONE — still at BILL
7. ~~Shashank Mishra — Senior Manager of RevOps, Mixpanel~~ DONE — moved to Board
8. ~~Sam Lee — Director of RevOps, Unit21~~ DONE — moved to Audio Enhancement
9. ~~Alex Carstens — VP of RevOps, Chowly~~ DONE — moved to Go Nimbly (consultancy!)
10. ~~Catherine Hsieh — Director of Sales Operations, Jasper~~ DONE — moved to First Round Capital / ServiceNow
11. ~~Steve Dinner — Head of RevOps, Owner.com~~ DONE — still at Owner.com, promoted to VP
12. ~~Jeff Ronaldi — Business Systems & GTM Ops Manager, Mezmo~~ DONE — still at Mezmo, promoted
13. ~~Brendan McDonald — Operations team lead, PartnerStack~~ DONE — now independent consultant!
14. ~~Hannah Bauhof — SalesOps Manager, Stream~~ DONE — moved to Rippling
15. ~~Samantha DeRosa — Senior Manager, Revenue Systems & Ops, Fundraise Up~~ DONE — moved to EverTrue as VP

### Wave 2 — Sales Leaders (Sarah persona)
16. ~~Jay Chung — Head of Revenue, Settle~~ DONE — still at Settle, promoted
17. ~~Jonathon Ilett — VP of Global Sales, Cognism~~ DONE — now CEO of TrustedIQ (UK startup!)
18. ~~Scott Kiever — CRO, Amino~~ DONE — moved to Lively
19. ~~Andrew Elliott — CRO, People Data Labs~~ DONE — moved to BreachRx as CRO
20. ~~Patrick Severs — Sr. Director of Sales, G2i~~ DONE — still at G2i

### Wave 3 — HubSpot Agency/Consultants (Rachel/Justin partner personas)
21. ~~Dustin Brackett — CEO & Founder, HIVE~~ DONE — still at HIVE (12 yrs)
22. ~~Michael Greene — Co-Founder, RevOdyssey~~ DONE — still at RevOdyssey, 1st degree connection! UK-based!
23. ~~Lica Wouters — Revenue Ops & Growth Strategist, Mind & Metrics~~ DONE — still at Mind & Metrics (12 yrs)

### Wave 4 — Additional RevOps/Ops from other competitors
24. ~~Natalie Blardony — Sales Ops Manager, Crunchbase~~ DONE — moved to Headway
25. ~~Michelle Fondren — Revenue Operations, MaintainX~~ DONE — still at MaintainX, promoted
26. ~~Oliver Levin — Revenue Operations, Memfault~~ DONE — still at Memfault, promoted
27. ~~Manny Foster — Director GTM Enablement, Fundraise Up~~ DONE — still at Fundraise Up
28. ~~Dylan Banever — Revenue Operations Manager, Brazen~~ DONE — now self-employed
29. ~~David Lovell — GTM & Sales Operations, SenseOn (UK)~~ DONE — moved to Form3, UK-based, 7 mutual connections!
30. ~~Jani McConnell — Director, Global Sales Operations, Persefoni~~ DONE — moved to IV.AI as VP

## Summary Stats (all 30 lookups complete)

- **Found**: 29/30 (Tarren Gill not found)
- **Still at review company**: 12 (41%)
- **Moved companies**: 16 (55%)
- **Not found**: 1 (3%)
- **UK-based**: 3 (Jonathon Ilett, Mike Greene, David Lovell)
- **Now independent/consulting**: 3 (Brendan McDonald, Alex Carstens, Dylan Banever)
- **1st degree connections**: 1 (Mike Greene)
- **5+ mutual connections**: 3 (Mike Greene 6, David Lovell 7, Jonathon Ilett 33)
