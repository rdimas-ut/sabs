import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./mystyles.css";
import { Col } from "react-bootstrap";
import { myTime, myDate } from "./DateHelpers";
const { ipcRenderer } = window.require("electron");

export const PolicyModal = (props) => {
  // Form input sho state
  const [edit, setEdit] = useState(true);
  const [validated, setValidated] = useState(false);

  // Excel Path
  const [excelpath, setPath] = useState("");

  // Policy ID only used if its not new entry
  const [pid, setPID] = useState(0);

  // Policy form input hooks
  const [mgu, setMGU] = useState("");
  const [carrier, setCarrier] = useState("");
  const [network, setNetwork] = useState("");
  const [admintpa, setAdminTPA] = useState("");
  const [mic, setMIC] = useState("");
  const [startdate, setStartDate] = useState("");
  const [billingtype, setBillingType] = useState("");

  const [specee, setSpecEE] = useState("");
  const [speces, setSpecES] = useState("");
  const [specec, setSpecEC] = useState("");
  const [specef, setSpecEF] = useState("");

  const [aggee, setAggEE] = useState("");
  const [agges, setAggES] = useState("");
  const [aggec, setAggEC] = useState("");
  const [aggef, setAggEF] = useState("");

  const [specstruc, setSpecStruc] = useState("");
  const [aggstruc, setAggStruc] = useState("1-Tier");

  const [premfees, setPremFees] = useState([
    {
      fpid: "",
      id: String(Date.now()),
      product: "",
      vendor: "",
      calc: "",
      rate: "",
    },
  ]);

  const [billfees, setBillFees] = useState([
    {
      bfid: "",
      id: String(Date.now()),
      product: "",
      vendor: "",
      calc: "",
      rate: "",
    },
  ]);

  const [excel, setExcel] = useState("");

  // Policy Form change state hooks
  const policyHooks = {
    mgu: setMGU,
    carrier: setCarrier,
    network: setNetwork,
    admintpa: setAdminTPA,
    mic: setMIC,
    startdate: setStartDate,

    specee: setSpecEE,
    speces: setSpecES,
    specec: setSpecEC,
    specef: setSpecEF,

    aggee: setAggEE,
    agges: setAggES,
    aggec: setAggEC,
    aggef: setAggEF,

    specstruc: setSpecStruc,
    aggstruc: setAggStruc,
    billingtype: setBillingType,
  };

  const staticChanges = (event) => {
    policyHooks[event.target.id](event.target.value);
  };

  const dynamicChanges = (listOfObjects, setFunc, id, key, value) => {
    const newListOfObjects = listOfObjects.map((obj) => {
      if (obj.id === id) {
        const altObj = obj;
        altObj[key] = value;
        return altObj;
      } else {
        return obj;
      }
    });

    setFunc(newListOfObjects);
  };

  const autoFillFromExcel = async () => {
    // Invokes parser in main electron app
    const result = await ipcRenderer.invoke("readExcel", excelpath);
    const censusResult = [
      result.EE,
      result.EC,
      result.ES,
      result.EF4,
      result.EF2,
      result.Comp,
      result.AggComp,
    ];

    // Sets Stop Loss Terms
    setMGU(result.MGU);
    setCarrier(result.Carrier);
    setNetwork(result.Network);
    setAdminTPA(result.Admin);
    setMIC(result.MIC);
    setStartDate(myDate(result.StartDate, true));
    console.log(result.StartDate);

    // Sets Specific Rates if they were found
    try {
      if (censusResult[5]) {
        setSpecStruc("1-Tier");
        setSpecEF(censusResult[5]);
      } else if (censusResult[4]) {
        setSpecStruc("2-Tier");
        setSpecEF(censusResult[4]);
        setSpecEE(censusResult[0]);
      } else if (censusResult[3]) {
        setSpecEE(censusResult[0]);
        setSpecEC(censusResult[1]);
        setSpecES(censusResult[2]);
        setSpecEF(censusResult[4]);
      }
    } catch (err) {
      console.log(err);
    }

    // Sets Aggregate Composite Rate if it was found
    try {
      if (censusResult[6]) {
        setAggStruc("1-Tier");
        setAggEF(censusResult[6]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deletePremiumFee = (id) => {
    const npremfees = premfees.filter((pf) => pf.id !== id);
    setPremFees(npremfees);
  };

  const createPremiumFee = () => {
    const npremfees = premfees;
    npremfees.push({
      fpid: "",
      id: String(Date.now()),
      product: "",
      vendor: "",
      calc: "",
      rate: "",
    });
    setPremFees(npremfees);
  };

  const deleteBillFee = (id) => {
    const nbillfees = billfees.filter((pf) => pf.id !== id);
    setBillFees(nbillfees);
  };

  const createBillFee = () => {
    const nbillfees = billfees;
    nbillfees.push({
      fpid: "",
      id: String(Date.now()),
      product: "",
      vendor: "",
      calc: "",
      rate: "",
    });
    setBillFees(nbillfees);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const isValid = form.checkValidity();
    if (isValid) {
      setValidated(false);
      const PID = pid ? pid : Date.now();
      const PolicyParams = {
        PID: PID,
        Customer: props.tabState[2],
        MGU: mgu,
        Carrier: carrier,
        Network: network,
        AdminTPA: admintpa,
        MIC: Number(mic),
        StartDate: myTime(startdate),
        Source: excel,
        BillingType: billingtype,
      };
      const CensusPremiumParams = [
        {
          PID: PID,
          TierStruc: specstruc,
          Type: "Specific",
          EE: Number(specee),
          ES: Number(speces),
          EC: Number(specec),
          EF: Number(specef),
        },
        {
          PID: PID,
          TierStruc: aggstruc,
          Type: "Aggregate",
          EE: Number(aggee),
          ES: Number(agges),
          EC: Number(aggec),
          EF: Number(aggef),
        },
      ].filter((cpr) => cpr.TierStruc);
      const FeesPremiumParams = premfees
        .filter((fp) => fp.vendor && fp.calc && fp.rate)
        .map((fp) => {
          var nfp = {
            PID: PID,
            Product: fp.product,
            Vendor: fp.vendor,
            Calc: fp.calc,
            Rate: Number(fp.rate),
          };
          if (fp.fpid) {
            nfp["FPID"] = fp.fpid;
          }
          return nfp;
        });
      const BillFeesParams = billfees
        .filter((bf) => bf.vendor && bf.calc && bf.rate)
        .map((bf) => {
          var nbf = {
            PID: PID,
            Product: bf.product,
            Vendor: bf.vendor,
            Calc: bf.calc,
            Rate: Number(bf.rate),
          };

          if (bf.bfid) {
            nbf["BFID"] = bf.fpid;
          }
          return nbf;
        });
      props.onPolicyInsert(
        PolicyParams,
        CensusPremiumParams,
        FeesPremiumParams,
        BillFeesParams
      );
      handleHide();
    }

    setValidated(true);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleReset = () => {
    Object.keys(policyHooks).forEach(function (key) {
      policyHooks[key]("");
    });
    setAggStruc("1-Tier");
    setPID(0);
    setPath("");
    setExcel("");
    setEdit(true);
    setValidated(false);
    setPremFees([
      {
        fpid: "",
        id: String(Date.now()),
        product: "",
        vendor: "",
        calc: "",
        rate: "",
      },
    ]);
    setBillFees([
      {
        bfid: "",
        id: String(Date.now()),
        product: "",
        vendor: "",
        calc: "",
        rate: "",
      },
    ]);
  };

  const handleHide = () => {
    handleReset();
    props.onHide();
  };

  const handleShow = () => {
    if (props.selectedPolicy) {
      setEdit(false);

      setPID(props.selectedPolicy.PID);

      setMGU(props.selectedPolicy.MGU);
      setCarrier(props.selectedPolicy.Carrier);
      setNetwork(props.selectedPolicy.Network);
      setAdminTPA(props.selectedPolicy.AdminTPA);
      setMIC(props.selectedPolicy.MIC);
      setStartDate(myDate(props.selectedPolicy.StartDate, true));
      setBillingType(props.selectedPolicy.BillingType);

      const selectedCensusPremium = props.censuspremium.filter(
        (cp) => cp.PID === props.selectedPolicy.PID
      );

      const selectedFeesPremium = props.feespremium.filter(
        (fp) => fp.PID === props.selectedPolicy.PID
      );

      const selectedBillFees = props.billfees.filter(
        (bf) => bf.PID === props.selectedPolicy.PID
      );

      for (const element of selectedCensusPremium) {
        if (element.Type === "Aggregate") {
          setAggStruc(element.TierStruc);
          setAggEE(element.EE);
          setAggES(element.ES);
          setAggEC(element.EC);
          setAggEF(element.EF);
        } else if (element.Type === "Specific") {
          setSpecStruc(element.TierStruc);
          setSpecEE(element.EE);
          setSpecES(element.ES);
          setSpecEC(element.EC);
          setSpecEF(element.EF);
        }
      }

      var nfp = [];
      for (const element of selectedFeesPremium) {
        nfp.push({
          fpid: element.FPID,
          id: Math.floor(Math.random() * 10000 + 1),
          product: element.Product,
          vendor: element.Vendor,
          calc: element.Calc,
          rate: element.Rate,
        });
      }
      nfp.push({
        fpid: "",
        id: String(Date.now()),
        product: "",
        vendor: "",
        calc: "",
        rate: "",
      });
      setPremFees(nfp);
      var nbf = [];
      for (const element of selectedBillFees) {
        nbf.push({
          bfid: element.BFID,
          id: Math.floor(Math.random() * 10000 + 1),
          product: element.Product,
          vendor: element.Vendor,
          calc: element.Calc,
          rate: element.Rate,
        });
      }
      nbf.push({
        bfid: "",
        id: String(Date.now()),
        product: "",
        vendor: "",
        calc: "",
        rate: "",
      });
      setBillFees(nbf);
      setExcel(props.selectedPolicy.Source);
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={handleHide}
      onShow={handleShow}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Policy Entry Form
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4>Stop Loss Terms</h4>
        <Form noValidate onSubmit={handleSubmit} validated={validated}>
          <Form.Group controlId="mgu">
            <Form.Label>MGU</Form.Label>
            <Form.Control
              disabled={!edit}
              value={mgu}
              onChange={staticChanges}
              type="text"
            />
          </Form.Group>

          <Form.Group controlId="carrier">
            <Form.Label>Carrier</Form.Label>
            <Form.Control
              disabled={!edit}
              value={carrier}
              onChange={staticChanges}
              type="text"
              required
            />
          </Form.Group>

          <Form.Group controlId="network">
            <Form.Label>Network</Form.Label>
            <Form.Control
              disabled={!edit}
              value={network}
              onChange={staticChanges}
              type="text"
            />
          </Form.Group>

          <Form.Group controlId="admintpa">
            <Form.Label>Administrator/TPA</Form.Label>
            <Form.Control
              disabled={!edit}
              value={admintpa}
              onChange={staticChanges}
              type="text"
            />
          </Form.Group>

          <Form.Group controlId="mic">
            <Form.Label>Months in Contract</Form.Label>
            <Form.Control
              disabled={!edit}
              value={mic}
              onChange={staticChanges}
              type="number"
              required
            />
          </Form.Group>

          <Form.Group controlId="billingtype">
            <Form.Label>Billing Type</Form.Label>
            <Form.Control
              required
              disabled={!edit}
              value={billingtype}
              onChange={staticChanges}
              as="select"
              className="mr-sm-2"
              custom
            >
              <option value="">Choose...</option>
              <option value="Census">Census</option>
              <option value="Self-Bill">Self-Bill</option>
              <option value="Self-Adjust">Self-Adjust</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="startdate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              required
              disabled={!edit}
              value={startdate}
              onChange={staticChanges}
              type="date"
            />
          </Form.Group>

          <h4>Premium Rates</h4>

          <Form.Group controlId="specstruc">
            <Form.Label>Specific Rate Structure</Form.Label>
            <Form.Control
              disabled={!edit}
              value={specstruc}
              onChange={staticChanges}
              as="select"
              className="mr-sm-2"
              custom
            >
              <option value="">Choose...</option>
              <option value="4-Tier">4-Tier</option>
              <option value="2-Tier">2-Tier</option>
              <option value="1-Tier">1-Tier</option>
            </Form.Control>
          </Form.Group>

          <Form.Row className="specrates">
            {specstruc && (specstruc === "4-Tier" || specstruc === "2-Tier") && (
              <Form.Group as={Col} md="3" controlId="specee">
                <Form.Label>EE</Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={specee}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
            {specstruc && specstruc === "4-Tier" && (
              <Form.Group as={Col} md="3" controlId="speces">
                <Form.Label>ES</Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={speces}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
            {specstruc && specstruc === "4-Tier" && (
              <Form.Group as={Col} md="3" controlId="specec">
                <Form.Label>EC</Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={specec}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
            {specstruc && (
              <Form.Group as={Col} md="3" controlId="specef">
                <Form.Label>
                  {specstruc === "1-Tier" ? "Comp" : "EF"}
                </Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={specef}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
          </Form.Row>

          <Form.Group controlId="aggstruc">
            <Form.Label>Aggregate Rate Structure</Form.Label>
            <Form.Control
              disabled={!edit}
              value={aggstruc}
              onChange={staticChanges}
              as="select"
              className="mr-sm-2"
              custom
            >
              <option value="">Choose...</option>
              <option value="4-Tier">4-Tier</option>
              <option value="2-Tier">2-Tier</option>
              <option value="1-Tier">1-Tier</option>
            </Form.Control>
          </Form.Group>

          <Form.Row className="aggrates">
            {aggstruc && (aggstruc === "4-Tier" || aggstruc === "2-Tier") && (
              <Form.Group as={Col} md="3" controlId="aggee">
                <Form.Label>EE</Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={aggee}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
            {aggstruc && aggstruc === "4-Tier" && (
              <Form.Group as={Col} md="3" controlId="agges">
                <Form.Label>ES</Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={agges}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
            {aggstruc && aggstruc === "4-Tier" && (
              <Form.Group as={Col} md="3" controlId="aggec">
                <Form.Label>EC</Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={aggec}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
            {aggstruc && (
              <Form.Group as={Col} md="3" controlId="aggef">
                <Form.Label>{aggstruc === "1-Tier" ? "Comp" : "EF"}</Form.Label>
                <Form.Control
                  disabled={!edit}
                  value={aggef}
                  onChange={staticChanges}
                  type="number"
                  step=".01"
                  placeholder="0.0"
                />
              </Form.Group>
            )}
          </Form.Row>

          <h4>Premium Fees</h4>

          {premfees.map((pf, i) => {
            return (
              <div key={pf.id}>
                <Form.Row className="premfeesdetails">
                  <Form.Group as={Col} md="3" controlId={pf.id}>
                    <Form.Label>Vendor</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={pf.vendor}
                      onChange={(e) =>
                        dynamicChanges(
                          premfees,
                          setPremFees,
                          pf.id,
                          "vendor",
                          e.target.value
                        )
                      }
                      type="text"
                      placeholder="Vendor"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId={pf.id}>
                    <Form.Label>Product</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={pf.product}
                      onChange={(e) =>
                        dynamicChanges(
                          premfees,
                          setPremFees,
                          pf.id,
                          "product",
                          e.target.value
                        )
                      }
                      type="text"
                      placeholder="Procuct"
                      as="select"
                      className="mr-sm-2"
                      custom
                    >
                      <option value="">Choose...</option>
                      {props.items.map((item) => {
                        return <option value={item.Name}>{item.Name}</option>;
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId={pf.id}>
                    <Form.Label>Calculation Method</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={pf.calc}
                      onChange={(e) =>
                        dynamicChanges(
                          premfees,
                          setPremFees,
                          pf.id,
                          "calc",
                          e.target.value
                        )
                      }
                      type="text"
                      as="select"
                      placeholder="Calculation Method"
                      className="mr-sm-2"
                      custom
                    >
                      <option value="">Choose...</option>
                      <option value="Flat Fee">Flat Fee</option>
                      <option value="Flat Per Census EE">
                        Flar Per Census EE
                      </option>
                      <option value="Flat Per Census ES">
                        Flar Per Census ES
                      </option>
                      <option value="Flat Per Census EC">
                        Flar Per Census EC
                      </option>
                      <option value="Flat Per Census EF">
                        Flar Per Census EF
                      </option>
                      <option value="Flat Per Census Composite">
                        Flar Per Census Composite
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId={pf.id}>
                    <Form.Label>Rate</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={pf.rate}
                      onChange={(e) =>
                        dynamicChanges(
                          premfees,
                          setPremFees,
                          pf.id,
                          "rate",
                          e.target.value
                        )
                      }
                      type="number"
                      step=".01"
                      placeholder="Rate"
                    />
                  </Form.Group>
                  {i === premfees.length - 1 && (
                    <div className="MyInlineButton">
                      <Button
                        disabled={!edit}
                        onClick={createPremiumFee}
                        size="sm"
                        variant="primary"
                      >
                        +
                      </Button>
                    </div>
                  )}
                  {i < premfees.length - 1 && (
                    <div className="MyInlineButton">
                      <Button
                        disabled={!edit}
                        onClick={() => deletePremiumFee(pf.id)}
                        size="sm"
                        variant="danger"
                      >
                        x
                      </Button>
                    </div>
                  )}
                </Form.Row>
              </div>
            );
          })}

          <h4>Vendor Fees</h4>

          {billfees.map((bf, i) => {
            return (
              <div key={bf.id}>
                <Form.Row className="MyFormRow">
                  <Form.Group as={Col} md="3" controlId={bf.id}>
                    <Form.Label>Vendor</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={bf.vendor}
                      onChange={(e) =>
                        dynamicChanges(
                          billfees,
                          setBillFees,
                          bf.id,
                          "vendor",
                          e.target.value
                        )
                      }
                      type="text"
                      placeholder="Vendor"
                      as="select"
                      className="mr-sm-2"
                      custom
                    >
                      <option value="">Choose...</option>
                      {props.vendors.map((ven) => {
                        return (
                          <option value={ven.DispName}>{ven.DispName}</option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId={bf.id}>
                    <Form.Label>Account</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={bf.product}
                      onChange={(e) =>
                        dynamicChanges(
                          billfees,
                          setBillFees,
                          bf.id,
                          "product",
                          e.target.value
                        )
                      }
                      type="text"
                      placeholder="Procuct"
                      as="select"
                      className="mr-sm-2"
                      custom
                    >
                      <option value="">Choose...</option>
                      {props.accounts.map((account) => {
                        return (
                          <option value={account.Name}>{account.Name}</option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId={bf.id}>
                    <Form.Label>Calculation Method</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={bf.calc}
                      onChange={(e) =>
                        dynamicChanges(
                          billfees,
                          setBillFees,
                          bf.id,
                          "calc",
                          e.target.value
                        )
                      }
                      type="text"
                      placeholder="Calculation Method"
                      as="select"
                      className="mr-sm-2"
                      custom
                    >
                      <option value="">Choose...</option>
                      <option value="Flat Fee">Flat Fee</option>
                      <option value="Flat Per Census EE">
                        Flar Per Census EE
                      </option>
                      <option value="Flat Per Census ES">
                        Flar Per Census ES
                      </option>
                      <option value="Flat Per Census EC">
                        Flar Per Census EC
                      </option>
                      <option value="Flat Per Census EF">
                        Flar Per Census EF
                      </option>
                      <option value="Flat Per Census Composite">
                        Flar Per Census Composite
                      </option>
                      <option value="Percent of Premium (Group)">
                        Percent of Premium (Group)
                      </option>
                      <option value="Percent of Premium (Carrier)">
                        Percent of Premium (Carrier)
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId={bf.id}>
                    <Form.Label>Rate</Form.Label>
                    <Form.Control
                      disabled={!edit}
                      value={bf.rate}
                      onChange={(e) =>
                        dynamicChanges(
                          billfees,
                          setBillFees,
                          bf.id,
                          "rate",
                          e.target.value
                        )
                      }
                      type="number"
                      step=".01"
                      placeholder="Rate"
                    />
                  </Form.Group>
                  {i === billfees.length - 1 && (
                    <div className="MyInlineButton">
                      <Button
                        disabled={!edit}
                        onClick={createBillFee}
                        size="sm"
                        variant="primary"
                      >
                        +
                      </Button>
                    </div>
                  )}
                  {i < billfees.length - 1 && (
                    <div className="MyInlineButton">
                      <Button
                        disabled={!edit}
                        onClick={() => deleteBillFee(bf.id)}
                        size="sm"
                        variant="danger"
                      >
                        x
                      </Button>
                    </div>
                  )}
                </Form.Row>
              </div>
            );
          })}

          <h4>Source</h4>
          <Form.Group>
            <Form.File
              disabled={!edit}
              custom
              id="excel"
              label={excel}
              data-browse="Select File"
              type="file"
              accept=".xlsx"
              onChange={(event) => {
                setExcel(event.target.files[0].name);
                setPath(event.target.files[0].path);
              }}
            ></Form.File>
          </Form.Group>

          <Form.Row>
            {edit && (
              <div className="MyFormButton">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </div>
            )}
            {excelpath && (
              <div className="MyFormButton">
                <Button onClick={autoFillFromExcel} variant="primary">
                  Load
                </Button>
              </div>
            )}
            {!edit && (
              <div className="MyFormButton">
                <Button onClick={handleEdit} variant="primary">
                  Edit
                </Button>
              </div>
            )}
            {edit && pid > 0 && (
              <div className="MyFormButton">
                <Button
                  onClick={() => {
                    handleHide();
                    props.onPolicyDelete(pid);
                  }}
                  variant="primary"
                >
                  Delete
                </Button>
              </div>
            )}
          </Form.Row>
        </Form>
      </Modal.Body>

      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
