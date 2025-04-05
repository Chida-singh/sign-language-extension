import pandas as pd
import os
import json

# Constants
VIDEO_FOLDER = "videos"
CSV_PATH = os.path.join(VIDEO_FOLDER, "how2sign_val.csv")
OUTPUT_JSON = os.path.join(VIDEO_FOLDER, "video-map.json")

# Load CSV
df = pd.read_csv(CSV_PATH)

# Get available video files (mp4 only)
available_videos = {
    f for f in os.listdir(VIDEO_FOLDER)
    if f.endswith(".mp4")
}
print(f"🎬 Found {len(available_videos)} videos.")

# Build mapping: word (gloss) -> filename
video_map = {}
skipped = 0

for _, row in df.iterrows():
    gloss = row.get("gloss", "").lower().strip()
    name = row.get("name", "").strip()
    
    # Construct filename
    filename = f"{name}-rgb_front.mp4"

    if filename in available_videos:
        video_map[gloss] = filename
    else:
        skipped += 1

# Save to JSON
with open(OUTPUT_JSON, "w") as f:
    json.dump(video_map, f, indent=2)

print(f"✅ Successfully mapped {len(video_map)} glosses.")
print(f"⚠️ Skipped {skipped} entries due to missing video files.")
print(f"📄 JSON saved to: {OUTPUT_JSON}")
