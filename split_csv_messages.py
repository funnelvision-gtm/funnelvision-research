#!/usr/bin/env python3
"""
Split a LinkedIn message CSV export into individual conversation markdown files.

Usage:
    python split_csv_messages.py "William LK messages.csv"
    python split_csv_messages.py messages.csv --outdir linkedin_messages

Output format matches the linkedin_message_export skill format.
"""

import csv
import sys
import os
import re
from collections import defaultdict
from datetime import datetime


def slugify(name: str) -> str:
    """Convert a name to a filename-safe slug."""
    # Remove emoji and special chars
    name = re.sub(r'[^\w\s-]', '', name)
    name = name.strip().lower()
    name = re.sub(r'[\s-]+', '_', name)
    return name


def parse_date(date_str: str) -> datetime:
    """Parse the CSV date format."""
    return datetime.strptime(date_str.strip(), "%Y-%m-%d %H:%M:%S %Z")


def format_date_heading(dt: datetime) -> str:
    """Format a date for the markdown heading (e.g. 'Mar 9, 2026')."""
    return dt.strftime("%b %-d, %Y")


def format_time(dt: datetime) -> str:
    """Format time (e.g. '2:30 PM')."""
    return dt.strftime("%-I:%M %p")


def identify_other_party(messages: list, owner: str) -> dict:
    """Figure out who the other person in the conversation is."""
    for msg in messages:
        if msg['from'] != owner:
            return {
                'name': msg['from'],
                'profile_url': msg['from_url'],
            }
        elif msg['to'] != owner:
            return {
                'name': msg['to'],
                'profile_url': msg['to_url'],
            }
    # Fallback: use the first message's to/from that isn't owner
    msg = messages[0]
    if msg['from'] == owner:
        return {'name': msg['to'], 'profile_url': msg['to_url']}
    return {'name': msg['from'], 'profile_url': msg['from_url']}


def has_other_response(messages: list, owner: str) -> bool:
    """Check if the other party ever sent a message."""
    return any(msg['from'] != owner for msg in messages)


def write_conversation(outdir: str, other: dict, messages: list, no_response: bool = False):
    """Write a single conversation to a markdown file."""
    if no_response:
        target_dir = os.path.join(outdir, "no_response")
        os.makedirs(target_dir, exist_ok=True)
    else:
        target_dir = outdir
    filename = slugify(other['name']) + '.md'
    filepath = os.path.join(target_dir, filename)

    # Sort messages chronologically (oldest first)
    messages.sort(key=lambda m: m['date'])

    lines = []
    lines.append(f"# LinkedIn Conversation: {other['name']}")
    lines.append("")
    lines.append(f"- **Name**: {other['name']}")
    lines.append(f"- **Profile URL**: {other['profile_url']}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Messages")
    lines.append("")

    current_date = None
    for msg in messages:
        dt = msg['date']
        date_heading = format_date_heading(dt)
        if date_heading != current_date:
            current_date = date_heading
            lines.append(f"### {date_heading}")
            lines.append("")

        time_str = format_time(dt)
        lines.append(f"**{msg['from']}** — {time_str}")

        # Indent message body as blockquote, handling multiline
        content = msg['content'].strip()
        if content:
            for para in content.split('\n'):
                para = para.strip()
                if para:
                    lines.append(f"> {para}")
                else:
                    lines.append(">")
        else:
            lines.append("> *(empty message)*")

        lines.append("")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    return filepath


def main():
    if len(sys.argv) < 2:
        print("Usage: python split_csv_messages.py <csv_file> [--outdir <dir>]")
        sys.exit(1)

    csv_file = sys.argv[1]
    outdir = "linkedin_messages"

    if "--outdir" in sys.argv:
        idx = sys.argv.index("--outdir")
        outdir = sys.argv[idx + 1]

    os.makedirs(outdir, exist_ok=True)

    # Detect the owner (most frequent sender)
    sender_counts = defaultdict(int)
    rows = []

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
            sender_counts[row['FROM']] += 1

    owner = max(sender_counts, key=sender_counts.get)
    print(f"Detected owner: {owner}")

    # Group by conversation ID
    conversations = defaultdict(list)
    for row in rows:
        conv_id = row['CONVERSATION ID']
        conversations[conv_id].append({
            'from': row['FROM'],
            'from_url': row['SENDER PROFILE URL'],
            'to': row['TO'],
            'to_url': row['RECIPIENT PROFILE URLS'],
            'date': parse_date(row['DATE']),
            'content': row['CONTENT'],
        })

    # Write each conversation
    written = 0
    no_response_count = 0
    for conv_id, messages in conversations.items():
        other = identify_other_party(messages, owner)
        no_response = not has_other_response(messages, owner)
        filepath = write_conversation(outdir, other, messages, no_response=no_response)
        msg_count = len(messages)
        label = " [no response]" if no_response else ""
        print(f"  {other['name']} ({msg_count} messages){label} -> {filepath}")
        written += 1
        if no_response:
            no_response_count += 1

    responded = written - no_response_count
    print(f"\nDone: {written} conversations written to {outdir}/")
    print(f"  {responded} with responses")
    print(f"  {no_response_count} with no response (in {outdir}/no_response/)")


if __name__ == '__main__':
    main()
