import React, { useEffect, useState, useMemo } from 'react'
import Event from '../event'

export default function(props) {
  const [timer, setTimer] = useState(0)

  const to = useMemo(() => props.config.to, [props.config.to])
  
  useEffect(() => {
    Event.trigger('change', to)
    const interval = setInterval(() => {
      setTimer(timer => {
        if (timer + 1 >= to) {
          clearInterval(interval)
        }
        return timer + 1
      })
    }, 1000);
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [to])
  return (
    <>
      <button onClick={() => setTimer(0)} >
        reset
      </button>
      <div>{timer}</div>
    </>
  )
}