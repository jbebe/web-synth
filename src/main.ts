import { SynthMessage } from "./shared-types"

const pitchRange = [0.005, 2.5]

async function initSynth() {
  const audioContext = new AudioContext()
  await audioContext.audioWorklet.addModule('synth.js')
  const whiteNoiseNode = new AudioWorkletNode(audioContext, 'white-noise-processor')
  whiteNoiseNode.connect(audioContext.destination)

  const $pitch: HTMLInputElement = document.querySelector('#synth-pitch')
  $pitch.addEventListener('input', ev => {
    const target = ev.target as HTMLInputElement
    const value = parseInt(target.value)
    // normalize pitch value
    const normalized = Math.pow(1.01272, value) + 0.005 - 1
    const buffer = new Float32Array([normalized]).buffer
    const message: SynthMessage = { type: 'pitch', data: buffer }
    whiteNoiseNode.port.postMessage(message, [buffer])
  })
}

document.querySelector('#synth-start').addEventListener('click', () => initSynth(), { once: true })
