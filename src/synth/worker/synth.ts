import { decodeUtf8Buffer } from "common/text-decoder"
import { Sequence, SynthMessage, WaveType } from "synth/shared/types"
import { Waves } from "./waves"

type KeyMap = Record<number, number>

class WhiteNoiseProcessor extends AudioWorkletProcessor {
  keys: KeyMap = {}
  waveType: WaveType = WaveType.Sine
  wave: Waves.IWaveGenerator
  sequence: Sequence

  constructor(){
    super()
    this.wave = createWave(this.waveType)
    this.port.addEventListener('message', ev => {
      const message = ev.data as SynthMessage
      switch (message.type){
        case 'key-press':
        {
          const freq = new Float32Array(message.data)[0]
          if (!this.keys[freq])
            this.keys[freq] = 0
          break
        }
        case 'key-release':
        {
          const freq = new Float32Array(message.data)[0]
          delete this.keys[freq]
          break
        }
        case 'wave-type':
        {
          this.waveType = new Uint32Array(message.data)[0] as WaveType
          this.wave = createWave(this.waveType)
          break
        }
        case 'sequencer-data':
        {
          this.sequence = JSON.parse(decodeUtf8Buffer(message.data))
          console.log('sequencer data', this.sequence)
          break
        }
        default: 
          throw new Error('Invalid message')
      }
    })
    this.port.start()
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    const output = outputs[0]
    
    for (const channel of output){
      for (let i = 0; i < channel.length; i++) {
        this.sequence && applySequencerOnKeyboard(this.sequence, this.keys)
        const keyboardVal = aggregateKeyboard(this.keys, this.wave)
        channel[i] = keyboardVal
      }
    }

    return true
  }
}

registerProcessor('white-noise-processor', WhiteNoiseProcessor)

function aggregateKeyboard(keys: KeyMap, wave: Waves.IWaveGenerator): number {
  const keyEntries = Object.entries(keys)
  if (keyEntries.length === 0) return 0
  let sum = 0
  for (const [freqStr, oldT] of keyEntries){
    const { t: newT, value } = wave.step(oldT, +freqStr)
    keys[+freqStr] = newT
    sum += value
  }
  return sum / keyEntries.length
}

function createWave(waveType: WaveType): Waves.IWaveGenerator {
  if (waveType === WaveType.Sine){
    return new Waves.Sine()
  }
  if (waveType === WaveType.Square){
    return new Waves.Square()
  }
  if (waveType === WaveType.Triangle){
    return new Waves.Triangle()
  }
  if (waveType === WaveType.Sawtooth){
    return new Waves.Sawtooth()
  }
  throw new Error(`Invalid wave type: ${waveType}`)
}

let previousIdx = -1
function applySequencerOnKeyboard(seq: Sequence, keys: KeyMap){
  const stepDuration = seq.bpm / 60.0
  const stepIdx = Math.floor((currentTime * stepDuration * 4.0) % seq.steps)
  if (stepIdx === previousIdx) return

  // clear old played keys
  for (const freqStr in keys){
    delete keys[+freqStr]
  }

  // set currently played keys:
  for (const freqStr in seq.sequence[stepIdx]){
    keys[+freqStr] = 0
  }

  previousIdx = stepIdx
}
