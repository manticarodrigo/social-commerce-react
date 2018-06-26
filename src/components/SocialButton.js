import React from 'react'
import SocialLogin from 'react-social-login'
import { Button } from '@material-ui/core'

const style = {
  color: '#fff',
  borderColor: '#fff',
  minWidth: '250px',
  margin: '0.5em'
}

const SocialButton = ({ children, triggerLogin, ...props }) => (
  <Button style={style} variant="outlined" onClick={triggerLogin} {...props}>
    { children }
  </Button>
)
 
export default SocialLogin(SocialButton)