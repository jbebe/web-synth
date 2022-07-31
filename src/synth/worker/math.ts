export namespace CustomMath {
  // square wave
  // y: [-1, 1]
  // x down: [0, 1], x up: [1, 2]
  export function square(x: number){
    const sinx = Math.sin(x)
    return sinx / Math.abs(sinx)
  }

  export function triangle(x: number){
    return Math.asin(Math.sin(x)) / (Math.PI*0.5)
  }
  
  export function sawtooth(x: number){
    return x % (2.0 * Math.PI)
  }
}