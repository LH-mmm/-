import React from 'react'
import style from './Child.module.scss'

export default function Child() {
  return (
    <div>
        Child
        <ul className={style.Hayley}>
            <li>child-1111</li>
            <li>child-1111</li>
            {/* <li>child-1111</li> */}
        </ul>
    </div>
  )
}
