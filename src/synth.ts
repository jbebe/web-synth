import { SynthMessage } from "./shared-types"


class WhiteNoiseProcessor extends AudioWorkletProcessor {
  private iter = 0.0
  private pitch = 0.1

  constructor(){
    super()
    this.port.addEventListener('message', ev => {
      const message = ev.data as SynthMessage
      switch (message.type){
        case 'pitch':
          if (message.data.byteLength !== 4) throw new Error('Invalid buffer length')
          const pitchValue = new Float32Array(message.data)[0]
          if (pitchValue === NaN || pitchValue === Infinity || pitchValue === -Infinity) throw new Error('Invalid pitch value: ')
          this.pitch = pitchValue
          break
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
        channel[i] = Math.sin(this.iter)
        this.iter += this.pitch
      }
    }

    return true
  }
}

registerProcessor('white-noise-processor', WhiteNoiseProcessor)
