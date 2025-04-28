
// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { REGISTER } from '../../graphql/mutations';
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
// import { Link, useNavigate } from 'react-router-dom';

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [register, { error }] = useMutation(REGISTER);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await register({ variables: { input: { username, password } } });
//       navigate('/login', { 
//         state: { 
//           registrationSuccess: true,
//           username 
//         } 
//       });
//     } catch (err) {
//       console.error('Registration error:', err);
//     }
//   };

//   return (
//     <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
//       <Row className="w-100" style={{ maxWidth: '400px' }}>
//         <Col>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <h2 className="text-center mb-4">CREATE AN ACCOUNT</h2>
              
//               {error && <Alert variant="danger">{error.message}</Alert>}
              
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3" controlId="formUsername">
//                   <Form.Label>Your Username</Form.Label>
//                   <Form.Control 
//                     type="text" 
//                     placeholder="Enter username" 
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formPassword">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control 
//                     type="password" 
//                     placeholder="Password" 
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formAgreeTerms">
//                   <FormCheck 
//                     type="checkbox" 
//                     label="I agree all statements in Terms of service" 
//                     checked={agreeTerms}
//                     onChange={(e) => setAgreeTerms(e.target.checked)}
//                     required
//                   />
//                 </Form.Group>

//                 <Button 
//                   variant="primary" 
//                   type="submit" 
//                   className="w-100 mb-3"
//                   disabled={!agreeTerms}
//                 >
//                   REGISTER
//                 </Button>
                
//                 <div className="text-center mt-3">
//                   Have already an account?{' '}
//                   <Link to="/login" className="text-decoration-none">
//                     Login here
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

// export default Register;




import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../graphql/mutations';
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
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../Layout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [register, { error }] = useMutation(REGISTER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ variables: { input: { username, password } } });
      navigate('/login', { 
        state: { 
          registrationSuccess: true,
          username 
        } 
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <Layout background={false}>
      <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Row className="w-100" style={{ maxWidth: '400px' }}>
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="text-center mb-4">CREATE AN ACCOUNT</h2>
                
                {error && <Alert variant="danger">{error.message}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Your Username</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formAgreeTerms">
                    <FormCheck 
                      type="checkbox" 
                      label="I agree all statements in Terms of service" 
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3"
                    disabled={!agreeTerms}
                  >
                    REGISTER
                  </Button>
                  
                  <div className="text-center mt-3">
                    Have already an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Login here
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

export default Register;
