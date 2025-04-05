// Load the mapping JSON
let videoMap = {};

fetch(chrome.runtime.getURL("video-map.json"))
  .then((res) => res.json())
  .then((data) => {
    videoMap = data;
    initOverlay();
  });

function initOverlay() {
  const videoElement = document.createElement("video");
  videoElement.id = "sign-video-overlay";
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.loop = false;
  document.body.appendChild(videoElement);

  const transcriptObserver = new MutationObserver(() => {
    const transcript = document.querySelector(".ytd-transcript-segment-renderer");
    if (transcript) {
      const text = transcript.innerText.toLowerCase();
      const word = findMatch(text);
      if (word) playSignVideo(word, videoElement);
    }
  });

  transcriptObserver.observe(document.body, { childList: true, subtree: true });
}

function findMatch(text) {
  return Object.keys(videoMap).find((word) => text.includes(word));
}

function playSignVideo(word, videoElement) {
  const videoPath = chrome.runtime.getURL("videos/" + videoMap[word]);
  videoElement.src = videoPath;
  videoElement.play();
}
