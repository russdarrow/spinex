---
name: youtube-extract
description: Extract the transcript, metadata and a structured breakdown from a YouTube video. Use whenever the user pastes a youtube.com or youtu.be link, or asks to "extract", "summarize", "break down", "pull details from" or "get the transcript of" a video, including Starter Story founder interviews. Always run the extractor script before saying anything about access; never claim YouTube is unreachable without its output.
---

# YouTube extract

Get the real transcript first, then write the breakdown from it. The user has
done this successfully before and expects it to work, so don't hedge or push
back before trying.

## Step 1: Run the extractor (always, first)

```bash
python3 .claude/skills/youtube-extract/scripts/yt_extract.py "<url>" "<scratchpad>/yt_<id>"
```

It installs `yt-dlp` and `youtube-transcript-api` if missing (PyPI is reachable
even on restricted networks), keeps the `&t=` start time from the URL, and writes
`meta.json`, `transcript.txt` (`[m:ss] text` lines) and `transcript.json`.

Exit codes:
- **0**: transcript ready. Go to step 2.
- **3, NETWORK_BLOCKED**: the environment's network policy refused
  `www.youtube.com`. This is a setting, not a missing tool. Tell the user in two
  lines: the host that was blocked, and the fix (cloud session: environment menu
  in the title bar → Edit → Network access → Custom, add `youtube.com`,
  `www.youtube.com`, `i.ytimg.com`, keep the package-manager defaults; docs:
  https://code.claude.com/docs/en/cloud-environments#network-access). Then go to
  step 3 right away. Don't stop and wait.
- **4, NO_TRANSCRIPT**: YouTube was reached but returned no captions (captions
  off, age or region lock, or a bot check on a datacenter IP). Say which, then
  go to step 3.

## Step 2: Write the breakdown from the transcript

Read all of `transcript.txt`. If the URL had a start time, note what is said
around that timestamp. Cite timestamps (`[4:32]`) for every number and claim.

For a **Starter Story** or other founder-interview video, use this layout and
leave a section out if the video doesn't cover it:

1. **Video**: title, channel, date, length, link
2. **Founder and business**: who, background, what the product does
3. **Key numbers**: revenue/MRR, profit, margins, users, downloads, conversion,
   pricing, costs, timeline (each with a timestamp)
4. **How it started**: the idea and how they validated it
5. **How they built it**: tools, tech stack, team, time to launch
6. **Growth and marketing**: each channel tried, what failed, what worked, the numbers
7. **Lessons and advice**: in the founder's words, short quotes allowed
8. **Takeaways**: 3–5 points the user could act on

For any other video: summary, key points with timestamps, notable quotes, takeaways.

Write in plain language. Keep it scannable.

## Step 3: Fallback when there is no transcript

Do these in order and stop at the first that works:

1. **Web search** for the title or ID (`"<video id>"`, then
   `"<title>" <channel>`). Recaps of Starter Story episodes often show up on
   starterstory.com, podcast pages, news recap sites and the founder's own X
   posts. Fetch the pages that load.
2. Fill in the step 2 layout from those sources. Put a clear line at the top
   saying the breakdown is **secondhand, not from the transcript**, and list the sources.
3. Offer the zero-network path: the user opens the video, clicks **...more →
   Show transcript**, copies it and pastes it in chat. With that, do step 2 as normal.

## Saving output

Keep transcripts and scratch files in the scratchpad. If the user wants to keep
the breakdown, save it as `notes/youtube/<yyyy-mm-dd>-<slug>.md` in the repo, or
publish it as an artifact if they want something to share.
