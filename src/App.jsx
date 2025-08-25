import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Environment, KeyboardControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense } from 'react'
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from 'ecctrl'

import Lights from './Lights'
import Map from './Map'
import CharacterModel from './CharacterModel'

export default function App() {
  /**
   * Keyboard control preset
   */
  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] },
    { name: 'action1', keys: ['1'] },
    { name: 'action2', keys: ['2'] },
    { name: 'action3', keys: ['3'] },
    { name: 'action4', keys: ['KeyF'] }
  ]

  /**
   * Character url preset
   */
  const characterURL = './Demon.glb'

  /**
   * Character animation set preset
   */
  const animationSet = {
    idle: 'CharacterArmature|Idle',
    walk: 'CharacterArmature|Walk',
    run: 'CharacterArmature|Run',
    jump: 'CharacterArmature|Jump',
    jumpIdle: 'CharacterArmature|Jump_Idle',
    jumpLand: 'CharacterArmature|Jump_Land',
    fall: 'CharacterArmature|Duck', // This is for falling from high sky
    action1: 'CharacterArmature|Wave',
    action2: 'CharacterArmature|Death',
    action3: 'CharacterArmature|HitReact',
    action4: 'CharacterArmature|Punch'
  }

  return (
    <>
      <EcctrlJoystick buttonNumber={5} />
      <Canvas
        shadows
        // onPointerDown={(e) => {
        //   if (e.pointerType === "mouse") {
        //     e.target.requestPointerLock();
        //   }
        // }}
      >
        <Perf position="top-left" minimal />
        <Environment background files="/night.hdr" />
        <Lights />
        <Suspense fallback={null}>
          <Physics timeStep="vary">
            <KeyboardControls map={keyboardMap}>
              <Ecctrl debug animated>
                <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
                  <CharacterModel />
                </EcctrlAnimation>
              </Ecctrl>
            </KeyboardControls>
            <Map />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  )
}
