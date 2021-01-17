import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import { myTime, myDate } from "./DateHelpers";

class InvoiceModal extends Component {
  state = {
    EE: "",
    ES: "",
    EC: "",
    EF: "",
    CovDate: "",
    User: "",
  };
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Census Entry
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate>
            <Form.Group controlId="user">
              <Form.Label>User</Form.Label>
              <Form.Control
                value={this.state.User}
                name="user"
                onChange={(e) => {
                  this.setState({ User: e.target.value });
                }}
                type="text"
                placeholder="First Last"
              />
            </Form.Group>

            <Form.Group controlId="covdate">
              <Form.Label>Coverage Month</Form.Label>
              <Form.Control
                name="covdate"
                value={myDate(this.state.CovDate)}
                onChange={(e) => {
                  const CovDate = myTime(e.target.value);
                  this.setState({ CovDate });
                }}
                type="month"
              />
            </Form.Group>

            <Form.Row className="MyFormRow">
              <Form.Group as={Col} md="3" controlId="formSpecEE">
                <Form.Label>EE</Form.Label>
                <Form.Control
                  value={this.state.EE}
                  onChange={(e) => this.setState({ EE: e.target.value })}
                  type="number"
                  step="1"
                  placeholder="EE"
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="censusES">
                <Form.Label>ES</Form.Label>
                <Form.Control
                  value={this.state.ES}
                  onChange={(e) => this.setState({ ES: e.target.value })}
                  type="number"
                  step="1"
                  placeholder="ES"
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="censusEC">
                <Form.Label>EC</Form.Label>
                <Form.Control
                  value={this.state.EC}
                  onChange={(e) => this.setState({ EC: e.target.value })}
                  type="number"
                  step="1"
                  placeholder="EC"
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="censusEF">
                <Form.Label>EF/Comp</Form.Label>
                <Form.Control
                  value={this.state.EF}
                  onChange={(e) => this.setState({ EF: e.target.value })}
                  type="number"
                  step="1"
                  placeholder="EF"
                />
              </Form.Group>
            </Form.Row>

            <Button
              disabled={!isValid}
              onClick={() => {
                console.log("Heyy");
              }}
              type="button"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }
}

export default InvoiceModal;
