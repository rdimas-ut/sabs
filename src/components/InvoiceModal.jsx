import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import { myTime, myDate } from "./DateHelpers";

export const InvoiceModal = (props) => {
  const [ee, setEE] = useState("");
  const [es, setES] = useState("");
  const [ec, setEC] = useState("");
  const [ef, setEF] = useState("");

  const [eeDis, setEEDis] = useState(false);
  const [esDis, setESDis] = useState(false);
  const [ecDis, setECDis] = useState(false);
  const [efDis, setEFDis] = useState(false);

  const censusValues = [ee, es, ec, ef];
  const censusFormHooks = {
    ee: setEE,
    es: setES,
    ec: setEC,
    ef: setEF,
  };
  const handleFormChanges = (event) => {
    censusFormHooks[event.target.id](event.target.value);
  };

  // Form validation and composite calculation hooks
  const [compositeValue, setCompositeValue] = useState("0");

  useEffect(() => {
    setCompositeValue(
      String(censusValues.reduce((a, b) => Number(a) + Number(b)))
    );
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Invoice</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate>
          <Form.Group controlId="policy">
            <Form.Label>Policy</Form.Label>
            <Form.Control
              name="policy"
              type="text"
              placeholder="Carrier-DD-MMM-YYY"
            />
          </Form.Group>

          <Form.Group controlId="billingtype">
            <Form.Label>Billing Type</Form.Label>
            <Form.Control
              name="billingtype"
              type="text"
              placeholder="Census/Self-Bill/Self-Adjust"
            />
          </Form.Group>

          <Form.Group controlId="covdate">
            <Form.Label>Invoice Month</Form.Label>
            <Form.Control name="covdate" type="month" />
          </Form.Group>

          <h4>Census</h4>

          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="2" controlId="ee">
              <Form.Label>EE</Form.Label>
              <Form.Control
                value={ee}
                onChange={handleFormChanges}
                disabled={eeDis}
                type="number"
                step="1"
                placeholder="0"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="es">
              <Form.Label>ES</Form.Label>
              <Form.Control
                disabled={esDis}
                value={es}
                onChange={handleFormChanges}
                type="number"
                step="1"
                placeholder="0"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="ec">
              <Form.Label>EC</Form.Label>
              <Form.Control
                disabled={ecDis}
                value={ec}
                onChange={handleFormChanges}
                type="number"
                step="1"
                placeholder="0"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="ef">
              <Form.Label>EF/Comp</Form.Label>
              <Form.Control
                value={ef}
                onChange={handleFormChanges}
                disabled={efDis}
                type="number"
                step="1"
                placeholder="0"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="composite">
              <Form.Label>Composite</Form.Label>
              <Form.Control disabled type="number" value={compositeValue} />
            </Form.Group>
          </Form.Row>

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
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>Aug 2020 - EE</td>
                    <td>
                      <select name="cars" id="cars">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                      </select>
                    </td>
                    <td>23.54</td>
                    <td>100</td>
                    <td>2345.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h4></h4>

          <Button type="button">Submit</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
