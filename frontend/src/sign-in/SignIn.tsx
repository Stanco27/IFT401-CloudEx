import { Button, Card, Container, Form } from "react-bootstrap";
import "./SignIn.css";

const SignIn = () => {
  return (
    <Container>
      <Card className="p-4 m-3">
        <h2>Sign In</h2>
        <p className="text-muted mb-0">
          Don't have an account?
          <a className="link ms-2" href="/Sign-Up">
            Sign Up
          </a>
        </p>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
            <Form.Text className="text-muted">
              Forgot your password?
              <a className="link ms-2" href="/Reset-Password">
                Reset Password
              </a>
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignIn;
