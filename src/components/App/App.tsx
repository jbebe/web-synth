import * as React from "react"
import styles from "./App.module.scss"
import { Keyboard } from "components/Keyboard/Keyboard"
import { WaveType } from "components/WaveType/WaveType"
import { Sequencer } from "components/Sequencer/Sequencer"

export const App = () => {
  return <div className={styles.app}>
    <div className={styles.table}>
      <WaveType />
      <Sequencer />
      <Keyboard />
    </div>
  </div>
}