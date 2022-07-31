import { range } from "common/helper"
import * as React from "react"
import { useContext, useReducer, useState } from "react"
import { SynthContext } from "synth/context"
import { ToneKeys } from "synth/keyboard"
import { Sequence } from "synth/shared/types"
import styles from "./Sequencer.module.scss"

export const Sequencer = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const synthContext = useContext(SynthContext)
  const [toneCount, setToneCount] = useState(12)
  const [stepCount, setStepCount] = useState(4 * 2)
  const [bpm, setBpm] = useState(130)
  const [sequence, setSequence] = useState<Sequence>({
    bpm: bpm,
    steps: stepCount,
    sequence: range(stepCount).map(_ => ({} as Record<number, boolean>))
  })
  const changeBpm = (bpm: number) => {
    sequence.bpm = bpm
    synthContext.setSequence(sequence)
    setBpm(bpm)
    setSequence(sequence)
  }
  const changeSteps = (steps: number) => {
    sequence.steps = steps
    sequence.sequence = range(steps).map(_ => ({} as Record<number, boolean>))
    synthContext.setSequence(sequence)
    setStepCount(steps)
    setSequence(sequence)
  }
  const toggleStep = (stepIdx: number, freq: number) => 
    (_: React.MouseEvent<HTMLTableCellElement>) => {
      const tones = sequence.sequence[stepIdx]
      if (freq in tones) delete tones[freq]
      else tones[freq] = true
      synthContext.setSequence(sequence)
      setSequence(sequence)
      forceUpdate()
    }
  return <div className={styles.sequencer}>
    <label>
      Steps: 
      <input 
        type="number" 
        min={4} max={4*4} step={4} 
        onInput={ev => changeSteps(+ev.currentTarget.value)} 
        defaultValue={stepCount} />
    </label>
    <label>
      BPM: 
      <input 
        type="number"
        min={60} max={300} step={5} 
        onInput={ev => changeBpm(+ev.currentTarget.value)} 
        defaultValue={bpm} />
    </label>
    <table>
      <tbody>
        {range(toneCount).reverse().map(toneIdx => {
          const tone = ToneKeys[toneIdx]
          return <tr key={toneIdx}>
            <td key={0}>{tone.note}</td>
            {range(stepCount).map((_, stepIdx) => {
              return <td 
                key={stepIdx + 1} 
                onClick={toggleStep(stepIdx, tone.freq)} 
                className={tone.freq in sequence.sequence[stepIdx] ? styles.active : ''}>
                  .
              </td>
            })}
          </tr>})}
      </tbody>
    </table>
  </div>
}
