import React from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'

const ResetPassword = () => {

    const [sent, setSent] = React.useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    }

  return (
    <Container>
        {!sent ? (
        <Card className='p-4 m-3'>
            <Form>
                <h2>Reset Password</h2>
                <p className='text-muted mb-4'>
                    Enter your email address below and we'll send you a verification code to reset your password.
                </p>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Send Reset Link
                </Button>
            </Form>
        </Card>
            ) : (
        <Card className='p-4 m-3'>
            <h2>Check Your Email</h2>
            <p className='text-muted mb-0'>
                If an account with that email exists, a password reset link has been sent. Please check your inbox.
            </p>
        </Card>
            )}
    </Container>
  )
}

export default ResetPassword