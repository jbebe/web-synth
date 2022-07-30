import { keyboard } from "./keyboard"
import { SampleRate } from "./shared/constants"
import { SynthMessage } from "./shared/types"

async function initSynth() {
  const audioContext = new AudioContext({ sampleRate: SampleRate })
  await audioContext.audioWorklet.addModule('synth.js')
  const whiteNoiseNode = new AudioWorkletNode(audioContext, 'white-noise-processor')
  whiteNoiseNode.connect(audioContext.destination)

  const $pitch: HTMLInputElement = document.querySelector('#synth-pitch')
  $pitch.addEventListener('input', ev => {
    const target = ev.target as HTMLInputElement
    const value = keyboard[+target.value].freq
    const buffer = new Float32Array([value]).buffer
    const message: SynthMessage = { type: 'pitch', data: buffer }
    whiteNoiseNode.port.postMessage(message, [buffer])
  })
}

document.querySelector('#synth-start').addEventListener('click', () => initSynth(), { once: true })
