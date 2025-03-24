import React from 'react'

const Button = ({ onClick, children, ...rest }) => {
  return (
    <button onClick={onClick} className='bg-white p-3 rounded-3xl cursor-pointer' {...rest}>
        {children}
    </button>
  )
}

export default Button