import React from "react";
import { Container, Nav, Navbar, NavLink } from "react-bootstrap";

const NavigationBar = () => {
  const [signedIn, setSignedIn] = React.useState(true);

  const IconContainer = () => (
    <Nav className="ms-auto d-flex align-items-center">
      <NavLink className="ms-2">🔔</NavLink>
      <NavLink>⚙️</NavLink>
    </Nav>
  );

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/Home">CloudEX</Navbar.Brand>
        {!signedIn ? (
          <Nav className="ms-auto d-flex align-items-center">
            <NavLink className="me-2" href="/Sign-In">Sign In</NavLink>
            <NavLink href="Sign-Up">Sign Up</NavLink>
          </Nav>
        ) : (
          <>
            <Nav className="d-flex align-items-center">
              <NavLink className="me-2" href="/Dashboard">Dashboard</NavLink>
              <NavLink className="me-2" href="/Buy-Sell">Buy/Sell</NavLink>
              <NavLink href="/Transactions">Transactions</NavLink>
            </Nav>
            <IconContainer />
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
