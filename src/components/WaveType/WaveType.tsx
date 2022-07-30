import * as React from "react"
import { SynthContext } from "synth/context"
import { WaveType as WaveTypeEnum } from "synth/shared/types"
import styles from "./WaveType.module.scss"

export const WaveType = () => {
  const synthContext = React.useContext(SynthContext)
  const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('set wave type')
    const mapper: Record<string, WaveTypeEnum> = {
      sine: WaveTypeEnum.Sine,
      square: WaveTypeEnum.Square,
    }
    return synthContext.setType(mapper[ev.target.value])
  }
  return <div className={styles.wavetype}>
    <select { ...onChange }>
      <option value="sine">sine</option>
      <option value="square">square</option>
      <option value="triangle">triangle</option>
    </select>
  </div>
}
