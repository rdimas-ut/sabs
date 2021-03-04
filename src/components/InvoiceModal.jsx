import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import { myDate } from "./DateHelpers";
import { useInterval } from "./CustomerHooks";

export const InvoiceModal = (props) => {
  const [policy, setPolicy] = useState("");
  const [billingtype, setBillingType] = useState("");
  const [invoicemonth, setInvoiceMonth] = useState("");

  const [ee, setEE] = useState("");
  const [es, setES] = useState("");
  const [ec, setEC] = useState("");
  const [ef, setEF] = useState("");

  // Adjustments in census
  const [adjust, setAdjust] = useState([]);

  // Derived from date
  const [feespremium, setFeesPremium] = useState([]);
  const [censuspremium, setCensusPremium] = useState([]);

  // Form validation and composite calculation hooks
  const [compositeValue, setCompositeValue] = useState("0");

  // Line array
  const [lines, setLines] = useState([]);

  // Total Array
  const [total, setTotal] = useState(0);

  const createCensusAndRates = () => {
    // Creates and array with filtered policies by customer
    var filteredpolicies = props.policies.filter(
      (policy) => policy.Customer === props.customer
    );

    var filteredcensus = props.census.filter(
      (cen) => cen.Customer === props.customer
    );
    filteredcensus.sort((a, b) => (a.CovDate < b.CovDate ? 1 : -1));

    if (invoicemonth && filteredpolicies.length) {
      // filters policies by date which their should only be one or none
      filteredpolicies = filteredpolicies.filter((policy) => {
        var inter = invoicemonth.split("-");
        var current = parseInt(inter[0]) * 12 + parseInt(inter[1]);
        inter = myDate(policy.StartDate).split("-");
        var inf = parseInt(inter[0]) * 12 + parseInt(inter[1]);
        var sup = parseInt(policy.MIC) + inf;

        return inf <= current && current < sup;
      });

      // uses the policy to set rates and bill lines
      if (filteredpolicies.length && filteredcensus.length) {
        var validcensus = filteredcensus[0];
        if (!ee && !es && !ec && !ef) {
          setEE(validcensus.EE);
          setEC(validcensus.EC);
          setES(validcensus.ES);
          setEF(validcensus.EF);
        }
      }

      var validpolicy = filteredpolicies[0];
      var filteredfeespremium = props.feespremium.filter(
        (fee) => fee.PID === validpolicy.PID
      );
      var filteredcensuspremium = props.censuspremium.filter(
        (fee) => fee.PID === validpolicy.PID
      );
      setBillingType(validpolicy.BillingType);
      setPolicy(validpolicy.Carrier + " " + myDate(validpolicy.StartDate));
      setFeesPremium(filteredfeespremium);
      setCensusPremium(filteredcensuspremium);
    } else {
      setFeesPremium([]);
      setCensusPremium([]);
      setAdjust([]);
    }
  };

  const createLines = () => {
    var newLines = [];
    if (censuspremium) {
      censuspremium.forEach((cp) => {
        if (cp.TierStruc === "1-Tier") {
          newLines.push({
            Description: "Comp",
            Product_Service: cp.Type,
            Rate: cp.EF,
            Lives: parseInt(compositeValue),
            Amount: (parseInt(compositeValue) * cp.EF).toFixed(2),
          });
        } else if (cp.TierStruc === "2-Tier") {
          newLines.push({
            Description: "EE",
            Product_Service: cp.Type,
            Rate: cp.EE,
            Lives: parseInt(ee),
            Amount: (parseInt(ee) * cp.EE).toFixed(2),
          });
          newLines.push({
            Description: "EF",
            Product_Service: cp.Type,
            Rate: cp.EF,
            Lives: parseInt(compositeValue) - parseInt(ee),
            Amount: ((parseInt(compositeValue) - parseInt(ee)) * cp.EF).toFixed(
              2
            ),
          });
        } else if (cp.TierStruc === "4-Tier") {
          newLines.push({
            Description: "EE",
            Product_Service: cp.Type,
            Rate: cp.EE,
            Lives: parseInt(ee),
            Amount: (parseInt(ee) * cp.EE).toFixed(2),
          });
          newLines.push({
            Description: "ES",
            Product_Service: cp.Type,
            Rate: cp.ES,
            Lives: parseInt(es),
            Amount: (parseInt(es) * cp.ES).toFixed(2),
          });
          newLines.push({
            Description: "EC",
            Product_Service: cp.Type,
            Rate: cp.EC,
            Lives: parseInt(ec),
            Amount: (parseInt(ec) * cp.EC).toFixed(2),
          });
          newLines.push({
            Description: "EF",
            Product_Service: cp.Type,
            Rate: cp.EF,
            Lives: parseInt(ef),
            Amount: (parseInt(ef) * cp.EF).toFixed(2),
          });
        }
      });
    }

    if (feespremium) {
      console.log(feespremium);
      feespremium.forEach((fp) => {
        if (fp.Calc === "Flat Fee") {
          newLines.push({
            Description: "Flat Fee",
            Product_Service: fp.Product,
            Rate: fp.Rate,
            Lives: 1,
            Amount: fp.Rate,
          });
        } else if (fp.Calc === "Flat Per Census EE") {
          newLines.push({
            Description: "Flat Per Census EE",
            Product_Service: fp.Product,
            Rate: fp.Rate,
            Lives: 1,
            Amount: fp.Rate,
          });
        } else if (fp.Calc === "Flat Per Census ES") {
          newLines.push({
            Description: "Flat Per Census ES",
            Product_Service: fp.Product,
            Rate: fp.Rate,
            Lives: 1,
            Amount: fp.Rate,
          });
        } else if (fp.Calc === "Flat Per Census EC") {
          newLines.push({
            Description: "Flat Per Census EC",
            Product_Service: fp.Product,
            Rate: fp.Rate,
            Lives: 1,
            Amount: fp.Rate,
          });
        } else if (fp.Calc === "Flat Per Census EF") {
          newLines.push({
            Description: "Flat Per Census EF",
            Product_Service: fp.Product,
            Rate: fp.Rate,
            Lives: 1,
            Amount: fp.Rate,
          });
        } else if (fp.Calc === "Flat Per Census Composite") {
          newLines.push({
            Description: "Flat Per Census Composite",
            Product_Service: fp.Product,
            Rate: fp.Rate,
            Lives: 1,
            Amount: fp.Rate,
          });
        }
      });
    }
    setLines(newLines);
    console.log(newLines);
  };

  const createComposite = () => {
    const censusValues = [ee, es, ec, ef];
    setCompositeValue(
      String(censusValues.reduce((a, b) => Number(a) + Number(b)))
    );
  };

  const createTotal = () => {
    var newTotal = 0;
    if (lines.length) {
      lines.forEach((line) => {
        newTotal += Number(line.Amount);
        console.log(line.Amount);
      });
    } else {
      newTotal = 0;
    }
    setTotal(newTotal);
  };

  useInterval(createComposite, 1000);
  useInterval(createCensusAndRates, 1000);
  useInterval(createLines, 1000);
  useInterval(createTotal, 1000);

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
              value={policy}
              onChange={(event) => {
                setPolicy(event.target.value);
              }}
              disabled
              type="text"
              placeholder="Carrier-DD-MMM-YYY"
            />
          </Form.Group>

          <Form.Group controlId="billingtype">
            <Form.Label>Billing Type</Form.Label>
            <Form.Control
              value={billingtype}
              onChange={(event) => {
                setBillingType(event.target.value);
              }}
              disabled
              type="text"
              placeholder="Census/Self-Bill/Self-Adjust"
            />
          </Form.Group>

          <Form.Group controlId="invicemonth">
            <Form.Label>Invoice Month</Form.Label>
            <Form.Control
              value={invoicemonth}
              onChange={(event) => {
                setInvoiceMonth(event.target.value);
              }}
              type="month"
            />
          </Form.Group>

          <h4>Census</h4>

          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="2" controlId="ee">
              <Form.Label>EE</Form.Label>
              <Form.Control
                value={ee}
                onChange={(event) => {
                  setEE(event.target.value);
                }}
                type="number"
                step="1"
                placeholder="0"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="es">
              <Form.Label>ES</Form.Label>
              <Form.Control
                value={es}
                onChange={(event) => {
                  setES(event.target.value);
                }}
                type="number"
                step="1"
                placeholder="0"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="ec">
              <Form.Label>EC</Form.Label>
              <Form.Control
                value={ec}
                onChange={(event) => {
                  setEC(event.target.value);
                }}
                type="number"
                step="1"
                placeholder="0"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="ef">
              <Form.Label>EF/Comp</Form.Label>
              <Form.Control
                value={ef}
                onChange={(event) => {
                  setEF(event.target.value);
                }}
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
              <Button type="button">Submit</Button>
            </div>
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
