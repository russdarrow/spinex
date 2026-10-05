#!/usr/bin/env python3
"""Pull metadata + transcript for a YouTube video.

Usage: yt_extract.py <youtube-url-or-id> [out_dir]

Writes to out_dir (default: ./yt_<id>):
  meta.json        title, channel, upload date, duration, views, description, chapters
  transcript.txt   "[mm:ss] text" lines
  transcript.json  raw segments (start, duration, text)

Exit codes: 0 ok, 2 bad input, 3 network blocked, 4 no transcript available.
"""
import json
import os
import re
import subprocess
import sys
from urllib.parse import parse_qs, urlparse

BLOCK_MARKERS = ("403 Forbidden", "Tunnel connection failed", "CONNECT tunnel failed",
                 "EGRESS_BLOCKED", "Unable to connect to proxy")


def ensure(pkg, module):
    try:
        __import__(module)
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-U", pkg],
                       check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def parse(url):
    """Return (video_id, start_seconds)."""
    if re.fullmatch(r"[\w-]{11}", url):
        return url, 0
    u = urlparse(url if "://" in url else "https://" + url)
    q = parse_qs(u.query)
    vid = None
    if u.hostname and u.hostname.endswith("youtu.be"):
        vid = u.path.lstrip("/").split("/")[0]
    elif "v" in q:
        vid = q["v"][0]
    else:
        m = re.search(r"/(?:shorts|embed|live|v)/([\w-]{11})", u.path)
        vid = m.group(1) if m else None
    t = (q.get("t") or q.get("start") or ["0"])[0]
    secs = 0
    for n, unit in re.findall(r"(\d+)([hms]?)", t):
        secs += int(n) * {"h": 3600, "m": 60}.get(unit, 1)
    return vid, secs


def ts(s):
    s = int(s)
    return f"{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}" if s >= 3600 else f"{s // 60}:{s % 60:02d}"


def blocked(err):
    return any(m in str(err) for m in BLOCK_MARKERS)


def get_meta(vid):
    ensure("yt-dlp", "yt_dlp")
    import yt_dlp
    opts = {"quiet": True, "no_warnings": True, "skip_download": True, "retries": 1}
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
    keep = ("id", "title", "channel", "uploader", "upload_date", "duration",
            "view_count", "like_count", "description", "chapters", "tags", "webpage_url")
    return {k: info.get(k) for k in keep}


def get_transcript(vid):
    ensure("youtube-transcript-api", "youtube_transcript_api")
    from youtube_transcript_api import YouTubeTranscriptApi
    api = YouTubeTranscriptApi()
    if hasattr(api, "fetch"):  # v1.x
        segs = api.fetch(vid, languages=["en", "en-US", "en-GB"])
        return [{"start": s.start, "duration": s.duration, "text": s.text} for s in segs]
    return YouTubeTranscriptApi.get_transcript(vid, languages=["en", "en-US", "en-GB"])


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    vid, start = parse(sys.argv[1])
    if not vid:
        print(f"ERROR: could not find a video id in {sys.argv[1]!r}")
        return 2
    out = sys.argv[2] if len(sys.argv) > 2 else f"yt_{vid}"
    os.makedirs(out, exist_ok=True)
    print(f"video_id={vid} start_at={ts(start)} out_dir={out}")

    errors = {}
    meta = None
    try:
        meta = get_meta(vid)
        meta["requested_start_seconds"] = start
        with open(f"{out}/meta.json", "w") as f:
            json.dump(meta, f, indent=2)
        print(f"OK meta: {meta.get('title')!r} by {meta.get('channel')} "
              f"({ts(meta.get('duration') or 0)})")
    except Exception as e:  # noqa: BLE001
        errors["meta"] = e
        print(f"FAIL meta: {str(e)[:300]}")

    segs = None
    try:
        segs = get_transcript(vid)
        with open(f"{out}/transcript.json", "w") as f:
            json.dump(segs, f)
        with open(f"{out}/transcript.txt", "w") as f:
            for s in segs:
                f.write(f"[{ts(s['start'])}] {s['text'].replace(chr(10), ' ')}\n")
        print(f"OK transcript: {len(segs)} segments -> {out}/transcript.txt")
    except Exception as e:  # noqa: BLE001
        errors["transcript"] = e
        print(f"FAIL transcript: {type(e).__name__}: {str(e)[:300]}")

    if segs:
        return 0
    if any(blocked(e) for e in errors.values()):
        print("\nNETWORK_BLOCKED: the network policy refused www.youtube.com.\n"
              "Fix: allow youtube.com, www.youtube.com, i.ytimg.com in the environment's "
              "network settings (cloud: environment menu -> Edit -> Network access -> Custom).")
        return 3
    print("\nNO_TRANSCRIPT: reached YouTube but no captions were returned "
          "(captions disabled, age/region locked, or bot check on this IP).")
    return 4


if __name__ == "__main__":
    sys.exit(main())
