import React from 'react'

const Card = ({ children, className = '' ,...rest}) => {
  return (
    <div className={`rounded-lg bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-md border border-gray-300 ${className}`} {...rest}>
        { children }
    </div>
  )
}

export default Card