export function range(length: number): number[]
export function range(from: number, to?: number): number[] {
  function _range(from: number, to: number){
    const length = to - from + 1
    return [...new Array(length)].map((_, idx) => idx + from)
  }
  if (!to) return _range(0, from - 1)
  return _range(from, to)
}

export function average(...values: number[]){
  return values.reduce((a, b) => a + b, 0) / values.length;
}