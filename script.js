// script.js
const textForm = document.getElementById('text-form');
const descriptionInput = document.getElementById('description');
const videoContainer = document.getElementById('video-container');
const languageSelect = document.createElement('select');

languageSelect.innerHTML = `
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="fr">French</option>
    <!-- Add more language options -->
`;

videoContainer.appendChild(languageSelect);

textForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const descriptionText = descriptionInput.value.trim();
    createVideoFromText(descriptionText);
});

function createVideoFromText(text) {
    // VEED.IO API call to generate video from text
    const apiUrl = 'https://api.veed.io/v1/video/generate';
    const apiKey = '4dcd5e3e-8348-4962-a43a-a0efb2c2c124';
    const data = {
        text: text,
        // Other API options (e.g., video style, background image, etc.)
    };

    fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            const videoUrl = data.video_url;
            // Add the video to the page
            const videoElement = document.createElement('video');
            videoElement.src = videoUrl;
            videoElement.controls = true;
            videoContainer.appendChild(videoElement);

            // Add video editing tools
            const videoControls = document.createElement('div');
            videoControls.innerHTML = `
            <button id="play-pause-btn">Play/Pause</button>
            <input id="volume-control" type="range" min="0" max="1" value="1">
            <div id="seek-bar">
                <input type="range" min="0" max="${videoElement.duration}">
            </div>
        `;

            videoContainer.appendChild(videoControls);

            // Handle play/pause button click
            document.getElementById('play-pause-btn').addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            });

            // Handle volume control change
            document.getElementById('volume-control').addEventListener('input', (e) => {
                videoElement.volume = e.target.value;
            });

            // Handle seek bar change
            document.getElementById('seek-bar').addEventListener('input', (e) => {
                videoElement.currentTime = e.target.value;
            });
        })
        .catch(error => console.error(error));
}

languageSelect.addEventListener('change', (e) => {
    const selectedLanguage = e.target.value;
    generateSubtitles(descriptionInput.value.trim(), selectedLanguage);
});

function generateSubtitles(text, language) {
    // VEED.IO API call to generate subtitles
    const apiUrl = 'https://api.veed.io/v1/subtitle/generate';
    const apiKey = 'YOUR_VEEP_IO_API_KEY';
    const data = {
        text: text,
        language: language
    };

    fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            const subtitleUrl = data.subtitle_url;
            // Add the subtitles to the video
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.src = subtitleUrl;
            track.label = language;
            track.default = true;
            videoElement.addTextTrack(track);
        })
        .catch(error => console.error(error));
}