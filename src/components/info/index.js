import React, { useContext } from 'react'
import Context from '../context'

export default function (props) {
  const obj = useContext(Context)
  return (
    <div>{obj.txt}</div>
  )
}