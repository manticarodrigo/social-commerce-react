import React from 'react';
import SocialLogin from 'react-social-login';
import { Button } from '@material-ui/core';
import Facebook from 'mdi-material-ui/Facebook';
import Google from 'mdi-material-ui/Google';
import './SocialButton.css';

const SocialButton = ({ children, triggerLogin, ...props }) => {
  const { type } = props;
  return (
    <Button
      className='SocialButton'
      variant='outlined'
      onClick={triggerLogin}
      {...props}>
      <div className='Provider'>
        {type === 'facebook' ? <Facebook /> : <Google />}
      </div>
      { children }
    </Button>
  )
} 
 
export default SocialLogin(SocialButton);