import React from 'react'
import { styles } from '../styles/style'

type Props = {}

const Policy = (props: Props) => {
  return (
    <div>
        <div className={`w-[95%] 800px:w-[92%] m-auto py-2 text-white px-3`}>
            <h1 className={`${styles.title} !text-start pt-2`}>
                Platform Terms and Condition
            </h1>
        </div>
    </div>
  )
}

export default Policy