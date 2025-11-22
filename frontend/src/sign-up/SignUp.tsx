import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "./SignUp.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <Container>
      <Card className="p-4 m-3">
        <h2>Sign Up</h2>
        <p className="text-muted mb-0">
          Already have an account?
          <Link className="link ms-2" to={"/Sign-In"}>
            Sign in
          </Link>
        </p>
        <Form>
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="formBasicName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="formBasicName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
          </Row>
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

            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className="mt-3"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignUp;
