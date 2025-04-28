
// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { LOGIN } from '../../graphql/mutations';
// import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { 
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Card,
//   Alert,
//   FormCheck
// } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const location = useLocation();
//   const [successMessage, setSuccessMessage] = useState(
//     location.state?.registrationSuccess 
//         ? `Registration successful! Please login with your credentials.` 
//         : null
//     );
//   const [login, { error }] = useMutation(LOGIN);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await login({ 
//         variables: { input: { username, password } } 
//       });
//       localStorage.setItem('token', data.login.accessToken);
//       if (rememberMe) {
//         localStorage.setItem('rememberMe', 'true');
//       }
//       navigate('/books');
//     } catch (err) {
//       console.error('Login error:', err);
//     }
//   };

//   return (
//     <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
//       <Row className="w-100" style={{ maxWidth: '400px' }}>
//         <Col>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <h2 className="text-center mb-4">Sign in with</h2>
              
//               {error && <Alert variant="danger">{error.message}</Alert>}
//               {successMessage && <Alert variant="success">{successMessage}</Alert>}
              
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3" controlId="formBasicEmail">
//                   <Form.Label>Email address</Form.Label>
//                   <Form.Control 
//                     type="text" 
//                     placeholder="Enter email" 
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formBasicPassword">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control 
//                     type="password" 
//                     placeholder="Password" 
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <div className="d-flex justify-content-between mb-3">
//                   <FormCheck 
//                     type="checkbox" 
//                     label="Remember me" 
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                   />
//                   <Link to="/forgot-password" className="text-decoration-none">
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <Button variant="primary" type="submit" className="w-100 mb-3">
//                   LOGIN
//                 </Button>
                
//                 <div className="text-center mt-3">
//                   Don't have an account?{' '}
//                   <Link to="/register" className="text-decoration-none">
//                     Register
//                   </Link>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../graphql/mutations';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  FormCheck
} from 'react-bootstrap';
import Layout from '../Layout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registrationSuccess 
      ? `Registration successful! Please login with your credentials.` 
      : null
  );
  const [login, { error }] = useMutation(LOGIN);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ 
        variables: { input: { username, password } } 
      });
      localStorage.setItem('token', data.login.accessToken);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      navigate('/books');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <Layout background={false}>
      <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Row className="w-100" style={{ maxWidth: '400px' }}>
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="text-center mb-4">Sign in with</h2>
                
                {error && <Alert variant="danger">{error.message}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter email" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between mb-3">
                    <FormCheck 
                      type="checkbox" 
                      label="Remember me" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>

                  <Button variant="primary" type="submit" className="w-100 mb-3">
                    LOGIN
                  </Button>
                  
                  <div className="text-center mt-3">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Register
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Login;