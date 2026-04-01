# LinkedIn Message Export Process

## How to export LinkedIn message history

### Setup
- Navigate to `https://www.linkedin.com/messaging/` in Chrome
- The page shows a conversation list on the left and the active thread on the right
- The first conversation is auto-selected

### For each conversation

1. **Read the page text** using `get_page_text` on the messaging tab
2. **Extract from the page text** (the thread content appears after "Load more conversations" or after the conversation list):
   - **Name**: appears as heading after the conversation list, e.g. `Jakob Nielsen (He/Him)`
   - **Headline**: appears after `1st degree connection · 1st`, e.g. `Broadlab is the first transparent AI-driven...`
   - **Profile URL**: use `read_page` on the name link — href will be `/in/ACoA...` format (encoded, but resolves correctly)
   - **Connection degree**: `1st degree connection` / `2nd` / `3rd`
3. **Extract messages** — each message block in the text follows this pattern:
   ```
   [Date heading, e.g. "Mar 9"]
   [Sender info, e.g. "Joshua Graham sent the following messages at 9:13 AM"]
   View [Name]'s profile
   [Sender Name]
   [Time, e.g. "9:13 AM"]
   👏 👍 😊 Open Emoji Keyboard    <-- ignore this line (reactions UI)
   [Message body text]
   ```
   - Date headings: `Mar 9`, `Mar 17`, `Today`, `Yesterday`, etc.
   - Sender + time come before each message
   - Message body follows the emoji keyboard line
4. **Write to markdown file** in `linkedin_messages/` directory using format:
   ```markdown
   # LinkedIn Conversation: [Name]

   - **Name**: [Full name]
   - **Profile URL**: [URL]
   - **Headline**: [Headline text]
   - **Connection**: [1st/2nd/3rd degree]

   ---

   ## Messages

   ### [Date]

   **[Sender Name]** — [Time]
   > [Message body]
   ```
5. **Click the next conversation** in the left panel:
   - Use `find "[Next Person Name] conversation"` to locate it
   - Click the heading element
   - Wait 2 seconds for thread to load

### Scrolling for more conversations

When all visible conversations in the left panel have been processed:
1. Look for "Load more conversations" button/link at bottom of conversation list
2. If present, click it and wait 2 seconds
3. If not present, scroll down in the conversation list:
   - Use `scroll_to` on the last visible conversation item
   - Or use `scroll` action on the conversation list area
4. New conversations will lazy-load as you scroll

### Tips
- The conversation list and thread content are both in the `get_page_text` output — the thread starts after the last conversation list item
- Profile URLs in messaging use the encoded format (`/in/ACoA...`) not `/in/username` — this is normal, they still resolve correctly
- For longer threads, you may need to scroll UP in the message thread to load older messages — LinkedIn lazy-loads message history
- To scroll up in a thread: use `scroll` with `direction: "up"` on the message area, then re-read with `get_page_text`
- The "Sent at" timestamps (e.g. `Sent at 3/9/2026, 9:13 AM`) are in the accessibility tree (`read_page`) but not always in `get_page_text` — use `read_page` with the thread container ref if you need exact timestamps
- Filename convention: lowercase name with underscores, e.g. `duncan_king.md`
- Messages from LinkedIn system (connection requests, etc.) may appear differently — skip or note them
- Group conversations will show multiple participant names in the header

### Parsing the page text

The `get_page_text` output contains both the conversation list AND the active thread. To separate them:

1. **Conversation list** ends at one of:
   - `Load more conversations`
   - The repeated contact name (it appears first in the list, then again as the thread header)
2. **Thread content** starts with:
   - Contact name (repeated)
   - `Status is reachable/offline`
   - `Mobile • Xm ago` or similar
   - Then headline, connection degree
3. **Messages** follow after the profile info section
4. **Form/UI elements** at the end can be ignored:
   - `Drag your file here`, `Write a message`, `Attach an image`, `Send`, etc.
