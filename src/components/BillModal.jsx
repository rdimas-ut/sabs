import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import { myDate, myTime } from "./DateHelpers";
import { useInterval } from "./CustomerHooks";

export const BillModal = (props) => {
  const [invoicemonth, setInvoiceMonth] = useState("");

  // New
  const [validated, setValidated] = useState(false);

  // Line array
  const [lines, setLines] = useState([]);
  const [adjustlines, setAdjustLines] = useState([]);

  // Total Array
  const [total, setTotal] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const isValid = form.checkValidity();
    if (isValid) {
      handleHide();
    }

    setValidated(true);
  };

  const handleReset = () => {};

  const handleHide = () => {
    handleReset();
    props.onHide();
  };

  return (
    <Modal
      show={props.show}
      onHide={handleHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Bill</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit} validated={validated}>
          <Form.Group controlId="invicemonth">
            <Form.Label>Invoice Month</Form.Label>
            <Form.Control
              value={invoicemonth}
              onChange={(event) => {
                setInvoiceMonth(event.target.value);
              }}
              type="month"
              required
            />
          </Form.Group>

          <h4>Lines</h4>

          <div className="MyTable InvoiceModalLines">
            <div>
              <table>
                <thead>
                  <th>Description</th>
                  <th>Product/Service</th>
                  <th>Rate</th>
                  <th>Lives</th>
                  <th>Amount</th>
                </thead>
              </table>
            </div>
            {lines.map((li) => {
              return (
                <div key={li.Description + li.Product_Service}>
                  <table>
                    <tbody>
                      <tr>
                        <td>{li.Description}</td>
                        <td>{li.Product_Service}</td>
                        <td>{li.Rate}</td>
                        <td>{li.Lives}</td>
                        <td>{li.Amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}

            {adjustlines.map((ali) => {
              return (
                <div key={ali.Description + ali.Product_Service}>
                  <table>
                    <tbody>
                      <tr>
                        <td>{ali.Description}</td>
                        <td>{ali.Product_Service}</td>
                        <td>{ali.Rate}</td>
                        <td>{ali.Lives}</td>
                        <td>{ali.Amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}

            <div key="blanktotal">
              <table>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div key="total">
              <table>
                <tbody>
                  <tr>
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h1></h1>
          <Form.Row>
            <div className="MyFormButton">
              <Button onClick={handleSubmit} type="button">
                Submit
              </Button>
            </div>
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
