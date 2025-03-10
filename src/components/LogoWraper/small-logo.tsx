import { useIsFetching } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'

function SmallLogo() {
  const isFetching = useIsFetching()

  return (
    <Link className='inline-block'  to={'/'} >
    <motion.img
    className={`w-12 ${isFetching?'motion-safe:animate-wiggle':""}`}
    initial={{y:-250}}
    animate={{y:0}}
    width={52}
    height={37}
    transition={{delay:.3 ,type:"spring" , stiffness:60}}
    src="/logo.png"
    alt="logo"
  />
    </Link>
  )
}

export default React.memo(SmallLogo)