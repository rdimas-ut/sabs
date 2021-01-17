import Modal from "react-bootstrap/Modal";
import React from "react";

export function ErrorModal(props) {
  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.errorTitle}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h1>{props.errorMessage} </h1>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
