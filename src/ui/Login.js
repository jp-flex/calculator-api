import { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import 'antd/dist/antd.js';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginClick();
  };

  const handleLoginClick = async () => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/v1/auth/login`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })})
      .then(resp => resp.json())
      .then(data => {
        if (!data.error) {
          handleLogin(data.token);
          setErrorMessage("");
        } else {
          setErrorMessage("Invalid username or password!");
        }
      })
      .catch(() => {
        setErrorMessage("Service Unavailable!");
      });
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        paddingTop: '50px', // Added padding top
      }}
    >
      <div
        style={{
          width: '300px',
          padding: '20px',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Login to Calculator App</h2>
        {errorMessage && (
          <Alert
            className="mb-3"
            message={errorMessage}
            type="error"
            showIcon
            closable
          />
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="username" style={{ marginBottom: '5px', display: 'block' }}>
              Username
            </label>
            <Input id="username" onChange={handleUsernameChange} value={username} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ marginBottom: '5px', display: 'block' }}>
              Password
            </label>
            <Input.Password id="password" onChange={handlePasswordChange} value={password} />
          </div>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
