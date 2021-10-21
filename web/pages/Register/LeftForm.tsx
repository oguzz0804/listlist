import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from 'react-bootstrap/Form';
import Link from "../../src/components/Link";

import styles from "./styles.module.scss";
import Button from "../../src/components/Button";
import { H3 } from "../../src/components/Heading";

const LeftFormWrapper = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  padding-right: 3%;
`;

const BottomDiv = styled.div`
  margin: 20px 0;
  font-size: 13px;
  text-align: center;
  color: gray;
`;

const LeftForm = () => {
  const [validated, setValidated] = React.useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return(
    <LeftFormWrapper>
      <H3 style={{marginBottom: 20}}>Register</H3>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className={styles.register_form}
      >
        <Form.Group className="mb-3" controlId="name">
          <FontAwesomeIcon icon="user"/>
          <Form.Control type="text" placeholder="Name" required/>
          <Form.Text className="text-muted">
            Your name will be displayed on your public profile.
          </Form.Text>
          <Form.Control.Feedback type="invalid">Please enter name.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <FontAwesomeIcon icon="envelope"/>
          <Form.Control type="email" placeholder="Email" required/>
          <Form.Control.Feedback type="invalid">Please enter email.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <FontAwesomeIcon icon="lock"/>
          <Form.Control type="password" placeholder="Password" required/>
          <Form.Control.Feedback type="invalid">Please enter password.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="passwordReenter">
          <FontAwesomeIcon icon="lock"/>
          <Form.Control type="password" placeholder="Re-enter Password" required/>
          <Form.Control.Feedback type="invalid">Please re-enter password.</Form.Control.Feedback>
        </Form.Group>

        <BottomDiv>
          {/*LISTLIST-TODO: create terms of use and privacy policy pages*/}
          By clicking Register, you agree to our <Link>Terms of Use</Link> and <Link>Privacy Policy</Link>
        </BottomDiv>

        <Button
          height="40px"
          width="100%"
          fontWeight="bold"
          type="submit"
        >
          Create Account
        </Button>
      </Form>
    </LeftFormWrapper>
  );
};

export default LeftForm;
