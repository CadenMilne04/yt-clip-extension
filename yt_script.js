const API_KEY = "AIzaSyB4hYTE1i5T6oaLwdTLR4tKGcKRBNgAyh4"

function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?&]+)/;
    const matches = url.match(regex);
    return matches ? matches[1] || matches[2] : null;
}

function parseISO8601Duration(duration) {
    const durationRegex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

    const match = durationRegex.exec(duration);
    if (!match) return null;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    const formattedDuration = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return formattedDuration;
}

function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

async function fetchVideoDetails(videoId) {
    try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=${videoId}&key=${API_KEY}`;
        const response = await fetch(apiUrl)
        return await response.json()
    } catch (error) {
        console.error(`Error fetching Video Details: ${error}`)
    }
}

async function fetchAndSendVideoInformation() {
    const url = window.location.href;
    const videoId = getYouTubeVideoId(url);
    const rawVideoDetails = await fetchVideoDetails(videoId)
    console.log(rawVideoDetails)
    const videoData = {
        title: rawVideoDetails.items[0].snippet.title,
        thumbnailUrl: rawVideoDetails.items[0].snippet.thumbnails.maxres.url,
        duration: parseISO8601Duration(rawVideoDetails.items[0].contentDetails.duration)
    }
    chrome.runtime.sendMessage(videoData);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "sendData") {
        fetchAndSendVideoInformation()
    }
});

