document.addEventListener('DOMContentLoaded', () => {

    const btn = document.querySelector('button');
    const user_text = document.querySelector('textarea');
    const audioElement = document.querySelector("audio");

    let show = false;
    
    user_text.addEventListener('keydown', function(event){
        if (event.key === 'Enter') {
            event.preventDefault();
            generateSpeech();
          }
    })

    btn.addEventListener('click', async (event) => {
        event.preventDefault();
        generateSpeech();
    })

    const playAudio = (audioData) => {
        const blob = new Blob([audioData], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        if(!show){
            audioElement.classList.remove("hide");
            show = true;
        }
        audioElement.src = audioUrl;
        audioElement.playbackRate = 0.75;
        audioElement.play();
    }
    
    const generateSpeech = async() => {
        const text = user_text.value.trim();
        console.log(text);
        if(text === '') return;
        fetch('/tts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"user_text": text})
        })
        .then((res)=>res.blob())
        .then((speech) => {
            const reader = new FileReader();
            reader.onload = () => {
              const audioData = reader.result; 
              playAudio(audioData);
            };
            reader.readAsArrayBuffer(speech);
        })
        .catch(error => {
            console.error('Error generating or playing audio:', error);
          });
    }
});
