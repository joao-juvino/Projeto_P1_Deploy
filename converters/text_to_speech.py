from TTS.api import TTS
import os
import io
import soundfile as sf
import numpy as np

TTS_MODEL = "tts_models/en/ljspeech/vits"
print(f"Carregando o modelo TTS: {TTS_MODEL}")
tts = TTS(model_name=TTS_MODEL, progress_bar=False, gpu=False)

def generate_audio_bytes(text: str) -> bytes:
    if not text.strip():
        raise ValueError("O texto não pode estar vazio")

    print(f"Gerando áudio em memória para o texto: '{text}'")

    waveform = tts.tts(text=text)

    buffer_de_memoria = io.BytesIO()

    sf.write(
        buffer_de_memoria,
        np.array(waveform),
        tts.synthesizer.tts_config.audio["sample_rate"],
        format='MP3'
    )

    buffer_de_memoria.seek(0)
    audio_bytes = buffer_de_memoria.read()

    print("foi")
    return audio_bytes