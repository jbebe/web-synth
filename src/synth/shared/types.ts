export type SynthMessage = {
  // message type
  type: 'key-press' 
    | 'key-release'
    | 'wave-type',

  // values
  data: ArrayBuffer
}

export enum WaveType {
  Sine = 0,
  Square = 1,
  Triangle = 2,
  Sawtooth = 3,
}