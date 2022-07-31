import * as React from "react"
import { SynthContext } from "synth/context"
import { WaveType as WaveTypeEnum } from "synth/shared/types"
import styles from "./WaveType.module.scss"

export const WaveType = () => {
  const synthContext = React.useContext(SynthContext)
  const onChangeWaveType = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const mapper: Record<string, WaveTypeEnum> = {
      sine: WaveTypeEnum.Sine,
      square: WaveTypeEnum.Square,
      triangle: WaveTypeEnum.Triangle,
      sawtooth: WaveTypeEnum.Sawtooth,
    }
    return synthContext.setType(mapper[ev.target.value])
  }
  return <div className={styles.wavetype}>
    <select onChange={onChangeWaveType}>
      <option value="sine">sine</option>
      <option value="square">square</option>
      <option value="triangle">triangle</option>
      <option value="sawtooth">sawtooth</option>
    </select>
  </div>
}
