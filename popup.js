function DownloadVideo() {
    //We need to get the video's length.
    const start = document.getElementById('clip-start').value
    const end = document.getElementById('clip-end').value
    alert(`Downloading from ${start} to ${end}`)
}

document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('download-button');
  button.addEventListener('click', DownloadVideo);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    document.getElementById('video-title').innerHTML = message.title
    document.getElementById('duration').innerHTML = message.duration
    document.getElementById('video-thumbnail').src = message.thumbnailUrl

});

function requestDataFromContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "sendData" });
    });
}

requestDataFromContentScript();
