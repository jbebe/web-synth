export type SynthMessage = {
  // message type
  type: 'key-press' 
    | 'key-release'
    | 'wave-type'
    | 'sequencer-data'

  // values
  data: ArrayBuffer
}

export enum WaveType {
  Sine = 0,
  Square = 1,
  Triangle = 2,
  Sawtooth = 3,
}

export type Sequence = {
  bpm: number
  steps: number
  sequence: Record<number, boolean>[]
}
