import * as React from "react"
import { useContext, useEffect, useState } from "react"
import { SynthContext } from "synth/context"
import { ToneKeys, KeyboardKeys } from "synth/keyboard"
import styles from "./Keyboard.module.scss"

export const Keyboard = () => {
  const [activeKeys, setActiveKeys] = useState<Record<number, boolean>>({})
  const synthContext = useContext(SynthContext)
  const isFlat = (x: string) => x.includes('b')
  let simpleIter = 0
  const getStyles = (idx: number, flat: boolean) => {
    const toneCount = 12
    const blackCount = 5
    let width = 100 / ((ToneKeys.length / toneCount) * (toneCount - blackCount))
    let left = simpleIter * width
    if (flat){
      width *= 0.5
      left -= width / 2
    }
    else {
      simpleIter += 1
    }
    return { width: `${width}%`, left: `${left}%` }
  }
  useEffect(() => {
    window.addEventListener('keydown', ev => {
      const indexOfKey = KeyboardKeys.indexOf(ev.key.toLowerCase())
      if (indexOfKey === -1) return
      const freq = ToneKeys[indexOfKey].freq
      synthContext.keyPress(freq)
      setActiveKeys({
        [ToneKeys[indexOfKey].freq]: true,
        ...activeKeys
      })
    })
    window.addEventListener('keyup', ev => {
      const indexOfKey = KeyboardKeys.indexOf(ev.key.toLowerCase())
      if (indexOfKey === -1) return
      const freq = ToneKeys[indexOfKey].freq
      synthContext.keyRelease(freq)
      delete activeKeys[freq]
      setActiveKeys(activeKeys)
    })
  }, [])
  return <div className={styles.keyboard}>
    {ToneKeys.map((x, idx) => {
      return <div 
        key={idx} 
        className={`${isFlat(x.note) ? styles.flat : ''} ${x.freq in activeKeys ? styles.active : ''}`} 
        style={(getStyles(idx, isFlat(x.note)))}
        onMouseDown={() => synthContext.keyPress(x.freq)}
        onMouseUp={() => synthContext.keyRelease(x.freq)} />
    })}
  </div>
}