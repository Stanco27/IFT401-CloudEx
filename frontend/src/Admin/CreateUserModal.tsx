import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
// REMOVED: import { createUser } from "../Api"; // API call is now done by the parent

export interface UserData {
  username: string;
  email: string;
  password_hash: string;
  roleId: number;
}

interface CreateUserModalProps {
  show: boolean;
  handleClose: () => void;
  // onSubmit is now required and takes UserData, throwing an error on failure.
  // The parent will handle the Promise resolution (success/failure)
  onSubmit: (data: UserData) => Promise<void>; 
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ show, handleClose, onSubmit }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roleId, setRoleId] = useState<number>(0); 

  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(false);

  // Use a single function for cleanup and closing
  const resetAndClose = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRoleId(0);
    setError("");
    setSuccessMessage("");
    setLoading(false);
    handleClose(); // Actually close the modal (managed by the parent)
  };
    
  // Clear local error/success states when modal is re-opened/closed
  useEffect(() => {
    if (show) {
        setError("");
        setSuccessMessage("");
    }
  }, [show]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    
    if (roleId < 0) {
      setError("Please select a valid user role.");
      return;
    }

    setLoading(true);

    try {
      const formData: UserData = { 
          username, 
          email, 
          password_hash: password, 
          roleId 
      };
      await onSubmit(formData); 
      setSuccessMessage(`Submitting user data for "${username}"...`);
      setTimeout(resetAndClose, 1200);

    } catch (err) {
      const msg = (err as Error)?.message || "Failed to create user.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={resetAndClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value.toLowerCase())}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value.toLowerCase())}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>User Role</Form.Label>
            <Form.Select
              value={roleId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoleId(parseInt(e.target.value, 10))}
              disabled={loading}
            >
              <option value={0}>Standard User (0)</option>
              <option value={1}>Administrator (1)</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Administrators have full access to this console.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Creating User..." : "Create User"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateUserModal;
