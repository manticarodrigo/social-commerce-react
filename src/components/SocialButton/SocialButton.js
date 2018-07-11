import React from 'react'
import SocialLogin from 'react-social-login'
import { Button } from '@material-ui/core'
import { Facebook, Google } from 'mdi-material-ui'
import './SocialButton.css'

const SocialButton = ({ children, triggerLogin, ...props }) => {
  const { type } = props
  return (
    <Button
      className='SocialButton'
      variant='outlined'
      onClick={triggerLogin}
      {...props}>
      <div className='Provider'>
        {props.type === 'facebook' ? <Facebook /> : <Google />}
      </div>
      { children }
    </Button>
  )
} 
 
export default SocialLogin(SocialButton)