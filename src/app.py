from transformers import VitsTokenizer, VitsModel
import torch
import numpy as np
import scipy.io.wavfile as wavfile
from flask import Flask, request, render_template, send_file
import os

app = Flask(__name__)

PORT = os.environ.get('PORT', 8080)

tokenizer = VitsTokenizer.from_pretrained("facebook/mms-tts-eng")
model = VitsModel.from_pretrained("facebook/mms-tts-eng")

def generateSpeech(user_input):
    inputs = tokenizer(text=user_input, return_tensors="pt")
    with torch.no_grad():
        outputs = model(inputs["input_ids"])

    waveform = outputs.waveform

    waveform_np = waveform.squeeze().cpu().numpy()

    scaled_waveform = np.clip(waveform_np * 32767, -32768, 32767).astype(np.int16)

    sampling_rate = 22050

    wavfile.write("output.wav", rate=sampling_rate, data=scaled_waveform)
 



@app.route('/tts', methods=['POST'])
def tts():
    text = request.json['user_text']

    generateSpeech(text)
    
    try:
        return send_file("output.wav", mimetype='audio/wav', as_attachment=True), 200
    except FileNotFoundError:
        return "File not found", 404

@app.route('/', methods=['GET'])
def getIndex():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)