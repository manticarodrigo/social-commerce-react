import React from 'react'
import SocialLogin from 'react-social-login'
import { Button } from '@material-ui/core'
import { Facebook, Google } from 'mdi-material-ui'

const style = {
  button: {
    color: '#fff',
    borderColor: '#fff',
    minWidth: '250px',
    margin: '0.5em'
  },
  svg: {
    position: 'absolute',
    top: 'calc(50% - 12px)',
    left: '8px'
  }
}

const SocialButton = ({ children, triggerLogin, ...props }) => {
  const { type } = props
  return (
    <Button
      style={style.button}
      variant='outlined'
      onClick={triggerLogin}
      {...props}>
      {props.type === 'facebook' ? <Facebook style={style.svg} /> : <Google style={style.svg} />}
      { children }
    </Button>
  )
} 
 
export default SocialLogin(SocialButton)