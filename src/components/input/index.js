import React, { useState, useMemo } from 'react'
import Temp from '../info/mid'
import Context from '../context'
import Timer from './timer'
import Forms from '../formily/triggerForm';
import Form2 from '../formily'

export default function () {
  const [ str, setStr ] = useState('')
  const changeValue = (e) => {
    setStr(e.target.value)
  }

  // const config = useMemo(() => ({to: 10}), [])
  const config = {to: 10}

  return (
    <div>
      <Context.Provider value={{txt: str}}>
        <input value={str} onChange={changeValue} />
        <Temp/>
      </Context.Provider>
      <Timer config={config} />
      <Forms />
      <Form2 />
    </div>
  )
}