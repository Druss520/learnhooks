import React, { useState, useEffect } from 'react'
import Info from './index'
import Event from '../event'

export default function() {
  const [ob, setOb] = useState(100)

  useEffect(() => {
    Event.on('change', (e) => {
      console.log(e)
      setOb(ob => ob + 1)
    })
  }, [])

  return (
    <div>
      hehe {ob}
      <Info/>
    </div>
  )
}