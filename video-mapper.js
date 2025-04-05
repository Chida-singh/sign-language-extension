(async () => {
    // 1. Get YouTube transcript lines
    const transcriptElems = Array.from(document.querySelectorAll("ytd-transcript-segment-renderer span"));
    const transcriptText = transcriptElems.map(el => el.innerText.toLowerCase()).join(" ");
  
    // 2. Load CSV (you’ll preload this in content.js or cache it)
    const csvText = await fetch(chrome.runtime.getURL("how2sign_val.csv")).then(r => r.text());
    const videoMap = {};
  
    csvText.split("\n").forEach(line => {
      const [id, sentence] = line.split(",", 2);
      if (sentence) {
        const key = sentence.trim().toLowerCase();
        if (!videoMap[key]) videoMap[key] = [];
        videoMap[key].push(id.trim());
      }
    });
  
    // 3. Match transcript with sentences in the dataset
    const matchedKeys = Object.keys(videoMap).filter(sentence => transcriptText.includes(sentence));
    console.log("Matched sentences:", matchedKeys);
  
    // 4. Overlay first matched video
    if (matchedKeys.length > 0) {
      const firstMatch = videoMap[matchedKeys[0]][0];
      const videoFile = `videos/${firstMatch}-rgb_front.mp4`; // Ensure naming matches
  
      let overlay = document.createElement("video");
      overlay.src = chrome.runtime.getURL(videoFile);
      overlay.autoplay = true;
      overlay.muted = true;
      overlay.loop = true;
      overlay.style = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 200px;
        height: auto;
        z-index: 10000;
        border: 3px solid #fff;
        border-radius: 10px;
      `;
      document.body.appendChild(overlay);
    } else {
      alert("No matching sign language video found.");
    }
  })();
  