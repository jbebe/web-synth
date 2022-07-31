import { SampleRate } from "../shared/constants"
import { CustomMath } from "./math"

export const PI2 = Math.PI * 2

export namespace Waves {

  const SineRate = (2.0 * Math.PI) / SampleRate

  export interface IWaveGenerator {
    step(t: number, freq: number): { t: number, value: number }
  }

  export abstract class Sinusoid {
    stepBase(t: number, freq: number, fn?: (x: number) => number): { t: number, value: number } {
      const value = fn!(t)
      if (t >= SampleRate)
        t = 0
      t += freq * SineRate
      return { t, value }
    }
  }

  export class Sine extends Sinusoid implements IWaveGenerator {
    step(t: number, freq: number){
      return this.stepBase(t, freq, Math.sin)
    }
  }

  export class Square extends Sinusoid implements IWaveGenerator {
    step(t: number, freq: number) {
      return this.stepBase(t, freq, CustomMath.square)
    }
  }

  export class Triangle extends Sinusoid implements IWaveGenerator {
    step(t: number, freq: number) {
      return this.stepBase(t, freq, CustomMath.triangle)
    }
  }

  export class Sawtooth extends Sinusoid implements IWaveGenerator {
    step(t: number, freq: number) {
      return this.stepBase(t, freq, CustomMath.sawtooth)
    }
  }
}