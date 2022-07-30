import { SampleRate } from "../shared/constants"

export const PI2 = Math.PI * 2

export namespace Waves {

  const SineRate = (2.0 * Math.PI) / SampleRate

  interface IWaveGenerator {
    // returns the current wave position on the y axis and increments the x value
    step(): number
  }

  class WaveBase {
    protected t: number
    protected freq: number

    constructor(freq: number){
      this.t = 0.0
      this.freq = freq
    }

    change(freq: number){
      this.freq = freq
    }
  }

  export class Sine extends WaveBase implements IWaveGenerator {
    constructor(freq: number = 440){
      super(freq)
    }

    step(): number {
      const result = Math.sin(this.t)
      if (this.t >= SampleRate)
        this.t = 0
      this.t += this.freq * SineRate
      return result
    }
  }
}