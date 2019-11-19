import React from 'react';
import PropTypes from 'prop-types';
import '../login_utils/css/main.css'
import '../login_utils/css/util.css'

class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

render() {

    var loginVerifier;
    if(this.props.isCorrect){
        loginVerifier = null;
    }
    else{
        const hStyle = { color: 'red' };
        loginVerifier = <h3 style={ hStyle }> Please enter correct credentials </h3>
	}
	const merStyle = { color: 'black' };
	

    return(
        <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
				<form className="login100-form validate-form">
					<span className="login100-form-title p-b-33">
						<h4 style={merStyle}>jpAlp</h4>
					</span>

					<div className="wrap-input100 validate-input">
						<input className="input100" type="text" name="username" placeholder="Username"
						 onChange={this.handle_change} value={this.state.username}/>
						<span className="focus-input100-1"></span>
						<span className="focus-input100-2"></span>
					</div>

					<div className="wrap-input100 rs1 validate-input" data-validate="Password is required">
						<input className="input100" type="password" name="password" placeholder="Password"
						 onChange={this.handle_change} value={this.state.password}/>
						<span className="focus-input100-1"></span>
						<span className="focus-input100-2"></span>
					</div>

					<div className="container-login100-form-btn m-t-20">
						<button onClick={e => this.props.handle_login(e, this.state)} className="login100-form-btn">
							Sign in
						</button>
						{loginVerifier}
					</div>



				</form>
			</div>
		</div>
	</div>
    )
	}
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired,
  isCorrect: PropTypes.bool.isRequired,
};