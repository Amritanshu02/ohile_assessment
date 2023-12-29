let mediaRecorder;
let recordedChunks = [];
let recordingIndex = 1;

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create a new audio element for each recording
        const audioPlayer = document.createElement('audio');
        audioPlayer.controls = true;
        audioPlayer.src = audioUrl;

        // Create a new div to hold the audio element
        const audioContainer = document.createElement('div');
        audioContainer.appendChild(audioPlayer);

        // Append the new audio container to the recordings container
        document.getElementById('messages').appendChild(audioContainer);

        // Reset recordedChunks and enable buttons
        recordedChunks = [];
        document.getElementById('stopButton').disabled = true;
        document.getElementById('recordButton').disabled = false;
    };

    mediaRecorder.start();
    document.getElementById('recordButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
}

function stopRecording() {
    mediaRecorder.stop();
}

document.getElementById('recordButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);