import { SynthMessage, WaveType } from "synth/shared/types"
import { Waves } from "./waves"

type KeyMap = {
  [key: number]: Waves.IWaveGenerator
}

class WhiteNoiseProcessor extends AudioWorkletProcessor {
  private keys: KeyMap = {}
  private waveType: WaveType = WaveType.Triangle

  constructor(){
    super()
    this.port.addEventListener('message', ev => {
      const message = ev.data as SynthMessage
      switch (message.type){
        case 'key-press':
        {
          const freq = new Float32Array(message.data)[0]
          if (!this.keys[freq]){
            this.keys[freq] = createWave(this.waveType, freq)
          }
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
      // console.log([channel.length, sampleRate]) --> 128,48000
      for (let i = 0; i < channel.length; i++) {
        channel[i] = aggregate(this.keys)
      }
    }

    return true
  }
}

registerProcessor('white-noise-processor', WhiteNoiseProcessor)

function aggregate(keys: KeyMap): number {
  const waves: Waves.IWaveGenerator[] = Object.values(keys)
  if (waves.length === 0) return 0
  let value = 0
  for (const wave of waves){
    value += wave.step()
  }
  return value / waves.length
}

function createWave(waveType: WaveType, freq: number): Waves.IWaveGenerator {
  if (waveType === WaveType.Sine){
    return new Waves.Sine(+freq)
  }
  if (waveType === WaveType.Square){
    return new Waves.Square(+freq)
  }
  if (waveType === WaveType.Triangle){
    return new Waves.Triangle(+freq)
  }
  throw new Error(`Invalid wave type: ${waveType}`)
}