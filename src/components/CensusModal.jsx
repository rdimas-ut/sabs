import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import { myTime, myDate } from "./DateHelpers";
import React, { useEffect, useState } from "react";

export function CensusModal(props) {
  // Form value hooks
  const [user, setUser] = useState("");
  const [covmonth, setCovMonth] = useState("");
  const [ee, setEE] = useState("");
  const [es, setES] = useState("");
  const [ec, setEC] = useState("");
  const [ef, setEF] = useState("");

  // Form validation and composite calculation hooks
  const [validated, setValidated] = useState(false);
  const [compositeValue, setCompositeValue] = useState("0");

  // Form input sho state
  const [edit, setEdit] = useState(true);
  const [newC, setNew] = useState(true);

  // Form inpute disables
  const [covmonthDis, setCovMonthDis] = useState(false);
  const [eeDis, setEEDis] = useState(false);
  const [esDis, setESDis] = useState(false);
  const [ecDis, setECDis] = useState(false);
  const [efDis, setEFDis] = useState(false);

  const censusValues = [ee, es, ec, ef];
  const censusFormHooks = {
    user: setUser,
    covmonth: setCovMonth,
    ee: setEE,
    es: setES,
    ec: setEC,
    ef: setEF,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const isValid = form.checkValidity();
    if (isValid) {
      const params = {
        Customer: props.tabState[2],
        EE: Number(ee),
        ES: Number(es),
        EC: Number(ec),
        EF: Number(ef),
        DTS: Math.floor(Date.now() / 1000),
        InvDate: "",
        CovDate: myTime(covmonth),
        Status: "Actual",
        User: user,
      };
      props.onCensusInsert(params, newC);
      props.onHide();
    }

    setValidated(true);
  };

  const handleEdit = () => {
    setEEDis(false);
    setESDis(false);
    setECDis(false);
    setEFDis(false);

    setEdit(true);
  };

  const handleFormChanges = (event) => {
    censusFormHooks[event.target.id](event.target.value);
  };

  const handleReset = () => {
    Object.keys(censusFormHooks).map(function (key) {
      censusFormHooks[key]("");
    });
    setUser("");

    setValidated(false);
    setCovMonthDis(false);
    setEEDis(false);
    setESDis(false);
    setECDis(false);
    setEFDis(false);

    setEdit(true);
    setNew(true);
  };

  const handleShow = () => {
    if (!props.newCensus) {
      setEE(props.selectedCensus.EE);
      setES(props.selectedCensus.ES);
      setEC(props.selectedCensus.EC);
      setEF(props.selectedCensus.EF);
      setCovMonth(myDate(props.selectedCensus.CovDate));

      setCovMonthDis(true);
      setEEDis(true);
      setESDis(true);
      setECDis(true);
      setEFDis(true);

      setEdit(false);
      setNew(false);
    }
  };

  const handleHide = () => {
    handleReset();
    props.onHide();
  };

  useEffect(() => {
    setCompositeValue(
      String(censusValues.reduce((a, b) => Number(a) + Number(b)))
    );
  });

  return (
    <Modal
      onShow={handleShow}
      onHide={handleHide}
      show={props.show}
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
        <Form noValidate onSubmit={handleSubmit} validated={validated}>
          {edit && (
            <Form.Group controlId="user">
              <Form.Label>User</Form.Label>
              <Form.Control
                value={user}
                onChange={handleFormChanges}
                required
                type="text"
                placeholder="First Last"
              />
              <Form.Control.Feedback type="invalid">
                User is a required field
              </Form.Control.Feedback>
            </Form.Group>
          )}
          <Form.Group controlId="covmonth">
            <Form.Label>Coverage Month</Form.Label>
            <Form.Control
              value={covmonth}
              onChange={handleFormChanges}
              disabled={covmonthDis}
              required
              type="month"
            />
            <Form.Control.Feedback type="invalid">
              Coverage Month is a required field
            </Form.Control.Feedback>
          </Form.Group>

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

          <Form.Row>
            {edit && (
              <div className="MyFormButton">
                <Button type="submit">Submit</Button>
              </div>
            )}
            {!edit && (
              <div className="MyFormButton" onClick={handleEdit}>
                <Button type="button">Edit</Button>
              </div>
            )}
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
