import * as React from "react"
import { SampleRate } from "./shared/constants"
import { Sequence, SynthMessage, WaveType } from "./shared/types"

class SynthService {
  audioContext?: AudioContext
  whiteNoiseNode?: AudioWorkletNode

  constructor(){
    console.log('SynthService created')
  }

  async initialize(){
    this.audioContext = new AudioContext({ sampleRate: SampleRate })
    await this.audioContext.audioWorklet.addModule('synth.js')
    this.whiteNoiseNode = new AudioWorkletNode(this.audioContext, 'white-noise-processor')
    this.whiteNoiseNode.connect(this.audioContext.destination)
  }

  async keyPress(freq: number){
    if (!this.audioContext) await this.initialize()
    const buffer = new Float32Array([freq]).buffer
    const message: SynthMessage = { type: 'key-press', data: buffer }
    this.whiteNoiseNode.port.postMessage(message, [buffer])
  }

  async keyRelease(freq: number){
    const buffer = new Float32Array([freq]).buffer
    const message: SynthMessage = { type: 'key-release', data: buffer }
    this.whiteNoiseNode.port.postMessage(message, [buffer])
  }

  async setType(type: WaveType){
    const buffer = new Uint32Array([type]).buffer
    const message: SynthMessage = { type: 'wave-type', data: buffer }
    this.whiteNoiseNode.port.postMessage(message, [buffer])
  }

  async setSequence(seq: Sequence){
    if (!this.audioContext) await this.initialize()
    const buffer = new TextEncoder().encode(JSON.stringify(seq)).buffer
    const message: SynthMessage = { type: 'sequencer-data', data: buffer }
    this.whiteNoiseNode.port.postMessage(message, [buffer])
  }
}

export const SynthContext = React.createContext(new SynthService())