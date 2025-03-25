import React from 'react'

const Button = ({ onClick, children, className = '' ,...rest }) => {
  return (
    <button onClick={onClick} className={`bg-white p-3 rounded-3xl cursor-pointer ${className}`} {...rest}>
        {children}
    </button>
  )
}

export default Button