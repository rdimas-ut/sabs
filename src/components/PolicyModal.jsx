import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./mystyles.css";
import { Col } from "react-bootstrap";
import { myTime, myDate } from "./DateHelpers";
const { ipcRenderer } = window.require("electron");

class PolicyModal extends Component {
  state = {
    formMGU: "",
    formCarrier: "",
    formNetwork: "",
    formAdminTPA: "",
    formMIC: "",
    formStartDate: "",
    formSpecEE: "",
    formSpecES: "",
    formSpecEC: "",
    formSpecEF: "",
    formAggEE: "",
    formAggES: "",
    formAggEC: "",
    formAggEF: "",

    SpecStruc: "",
    AggStruc: "1-Tier",
    RenderedPremFees: 1,
    PremiumFees: [
      {
        id: 1,
        formPremFeeVendor: "",
        formPremFeeCalMethod: "",
        formPremFeeRate: "",
      },
    ],
    RenderedVenFees: 1,
    VendorFees: [
      {
        id: 1,
        formVendorFeeVendor: "",
        formVendorFeeCalMethod: "",
        formVendorFeeRate: "",
      },
    ],
    source: "Some Files",
    newsource: "",

    excelfile: "",
    excelLabel: "Excel (.xlsx) File",
    loadButton: 1,
  };

  deletePremiumFee = (id) => {
    const PremiumFees = this.state.PremiumFees.filter((p) => p.id !== id);
    this.setState({ PremiumFees });
  };

  createPremiumFee = () => {
    const PremiumFees = this.state.PremiumFees;
    const RenderedPremFees = this.state.RenderedPremFees + 1;
    PremiumFees.push({
      id: RenderedPremFees,
      formPremFeeVendor: "",
      formPremFeeCalMethod: "",
      formPremFeeRate: "",
    });
    this.setState({ RenderedPremFees });
    this.setState({ PremiumFees });
  };

  renderPremiumFeesButton = (l, i, id) => {
    i += 1;
    if (l === 1 || l === i) {
      return (
        <div className="MyInlineButton">
          <Button
            size="sm"
            onClick={() => this.createPremiumFee()}
            variant="primary"
          >
            +
          </Button>
        </div>
      );
    } else if (i < l) {
      return (
        <div className="MyInlineButton">
          <Button
            size="sm"
            onClick={() => this.deletePremiumFee(id)}
            variant="danger"
          >
            x
          </Button>
        </div>
      );
    }
  };

  renderPremiumFees = () => {
    const { PremiumFees } = this.state;
    const preFeesLength = PremiumFees.length;
    return PremiumFees.map((pf, i) => {
      return (
        <div key={pf.id}>
          <Form.Row className="MyFormRow">
            <Form.Group
              as={Col}
              md="3"
              controlId={"formPremFeeVendor" + String(pf.id)}
            >
              <Form.Label>Vendor</Form.Label>
              <Form.Control
                value={this.state.PremiumFees[i].formPremFeeVendor}
                onChange={(e) => {
                  const PremiumFees = this.state.PremiumFees.map((p) => {
                    if (pf.id === p.id) {
                      const np = p;
                      np.formPremFeeVendor = e.target.value;
                      return np;
                    } else {
                      return p;
                    }
                  });
                  this.setState({ PremiumFees });
                }}
                type="text"
                placeholder="Vendor"
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId={"formPremFeeCalMethod" + String(pf.id)}
            >
              <Form.Label>Calculation Method</Form.Label>
              <Form.Control
                value={this.state.PremiumFees[i].formPremFeeCalMethod}
                onChange={(e) => {
                  const PremiumFees = this.state.PremiumFees.map((p) => {
                    if (pf.id === p.id) {
                      const np = p;
                      np.formPremFeeCalMethod = e.target.value;
                      return np;
                    } else {
                      return p;
                    }
                  });
                  this.setState({ PremiumFees });
                }}
                type="text"
                placeholder="Calculation Method"
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId={"formPremFeeRate" + String(pf.id)}
            >
              <Form.Label>Rate</Form.Label>
              <Form.Control
                value={this.state.PremiumFees[i].formPremFeeRate}
                onChange={(e) => {
                  const PremiumFees = this.state.PremiumFees.map((p) => {
                    if (pf.id === p.id) {
                      const np = p;
                      np.formPremFeeRate = e.target.value;
                      return np;
                    } else {
                      return p;
                    }
                  });
                  this.setState({ PremiumFees });
                }}
                type="number"
                placeholder="Rate"
              />
            </Form.Group>
            {this.renderPremiumFeesButton(preFeesLength, i, pf.id)}
          </Form.Row>
        </div>
      );
    });
  };

  deleteVendorFee = (id) => {
    const VendorFees = this.state.VendorFees.filter((p) => p.id !== id);
    this.setState({ VendorFees });
  };

  createVendorFee = () => {
    const VendorFees = this.state.VendorFees;
    const RenderedVenFees = this.state.RenderedVenFees + 1;
    VendorFees.push({
      id: RenderedVenFees,
      formVendorFeeVendor: "",
      formVendorFeeCalMethod: "",
      formVendorFeeRate: "",
    });
    this.setState({ RenderedVenFees });
    this.setState({ VendorFees });
  };

  renderVendorFeesButton = (l, i, id) => {
    i += 1;
    if (l === 1 || l === i) {
      return (
        <div className="MyInlineButton">
          <Button
            size="sm"
            onClick={() => this.createVendorFee()}
            variant="primary"
          >
            +
          </Button>
        </div>
      );
    } else if (i < l) {
      return (
        <div className="MyInlineButton">
          <Button
            size="sm"
            onClick={() => this.deleteVendorFee(id)}
            variant="danger"
          >
            x
          </Button>
        </div>
      );
    }
  };

  renderVendorFees = () => {
    const { VendorFees } = this.state;
    const vendorFeesLenght = VendorFees.length;
    return VendorFees.map((vf, i) => {
      return (
        <div key={vf.id}>
          <Form.Row className="MyFormRow">
            <Form.Group
              as={Col}
              md="3"
              controlId={"formVendorFeeVendor" + String(vf.id)}
            >
              <Form.Label>Vendor</Form.Label>
              <Form.Control
                value={this.state.VendorFees[i].formVendorFeeVendor}
                onChange={(e) => {
                  const VendorFees = this.state.VendorFees.map((v) => {
                    if (vf.id === v.id) {
                      const vp = v;
                      vp.formVendorFeeVendor = e.target.value;
                      return vp;
                    } else {
                      return v;
                    }
                  });
                  this.setState({ VendorFees });
                }}
                type="text"
                placeholder="Vendor"
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId={"formVendorFeeCalMethod" + String(vf.id)}
            >
              <Form.Label>Calculation Method</Form.Label>
              <Form.Control
                value={this.state.VendorFees[i].formVendorFeeCalMethod}
                onChange={(e) => {
                  const VendorFees = this.state.VendorFees.map((v) => {
                    if (vf.id === v.id) {
                      const vp = v;
                      vp.formVendorFeeCalMethod = e.target.value;
                      return vp;
                    } else {
                      return v;
                    }
                  });
                  this.setState({ VendorFees });
                }}
                type="text"
                placeholder="Calculation Method"
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId={"formVendorFeeRate" + String(vf.id)}
            >
              <Form.Label>Rate</Form.Label>
              <Form.Control
                value={this.state.VendorFees[i].formVendorFeeRate}
                onChange={(e) => {
                  const VendorFees = this.state.VendorFees.map((v) => {
                    if (vf.id === v.id) {
                      const vp = v;
                      vp.formVendorFeeRate = e.target.value;
                      return vp;
                    } else {
                      return v;
                    }
                  });
                  this.setState({ VendorFees });
                }}
                type="number"
                placeholder="Rate"
              />
            </Form.Group>
            {this.renderVendorFeesButton(vendorFeesLenght, i, vf.id)}
          </Form.Row>
        </div>
      );
    });
  };

  renderSpecRates = () => {
    var { SpecStruc } = this.state;
    if (SpecStruc === "4-Tier") {
      return (
        <div>
          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formSpecEE">
              <Form.Label>EE</Form.Label>
              <Form.Control
                value={this.state.formSpecEE}
                onChange={(e) => this.setState({ formSpecEE: e.target.value })}
                type="number"
                step=".01"
                placeholder="EE"
              />
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="formSpecES">
              <Form.Label>ES</Form.Label>
              <Form.Control
                value={this.state.formSpecES}
                onChange={(e) => this.setState({ formSpecES: e.target.value })}
                type="number"
                step=".01"
                placeholder="ES"
              />
            </Form.Group>
          </Form.Row>

          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formSpecEC">
              <Form.Label>EC</Form.Label>
              <Form.Control
                value={this.state.formSpecEC}
                onChange={(e) => this.setState({ formSpecEC: e.target.value })}
                type="number"
                step=".01"
                placeholder="EC"
              />
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="formSpecEF">
              <Form.Label>EF</Form.Label>
              <Form.Control
                value={this.state.formSpecEF}
                onChange={(e) => this.setState({ formSpecEF: e.target.value })}
                type="number"
                step=".01"
                placeholder="EF"
              />
            </Form.Group>
          </Form.Row>
        </div>
      );
    } else if (SpecStruc === "2-Tier") {
      return (
        <div>
          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formSpecEE">
              <Form.Label>EE</Form.Label>
              <Form.Control
                value={this.state.formSpecEE}
                onChange={(e) => this.setState({ formSpecEE: e.target.value })}
                type="number"
                step=".01"
                placeholder="EE"
              />
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="formSpecEF">
              <Form.Label>EF</Form.Label>
              <Form.Control
                value={this.state.formSpecEF}
                onChange={(e) => this.setState({ formSpecEF: e.target.value })}
                type="number"
                step=".01"
                placeholder="EF"
              />
            </Form.Group>
          </Form.Row>
        </div>
      );
    } else if (SpecStruc === "1-Tier") {
      return (
        <div>
          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formSpecEF">
              <Form.Label>Comp</Form.Label>
              <Form.Control
                value={this.state.formSpecEF}
                onChange={(e) => this.setState({ formSpecEF: e.target.value })}
                type="number"
                step=".01"
                placeholder="Comp"
              />
            </Form.Group>
          </Form.Row>
        </div>
      );
    }
    return;
  };

  renderAggRates = () => {
    var { AggStruc } = this.state;
    if (AggStruc === "4-Tier") {
      return (
        <div>
          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formAggEE">
              <Form.Label>EE</Form.Label>
              <Form.Control
                value={this.state.formAggEE}
                onChange={(e) => this.setState({ formAggEE: e.target.value })}
                type="number"
                step=".01"
                placeholder="EE"
              />
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="formAggES">
              <Form.Label>ES</Form.Label>
              <Form.Control
                value={this.state.formAggES}
                onChange={(e) => this.setState({ formAggES: e.target.value })}
                type="number"
                step=".01"
                placeholder="ES"
              />
            </Form.Group>
          </Form.Row>

          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formAggEC">
              <Form.Label>EC</Form.Label>
              <Form.Control
                value={this.state.formAggEC}
                onChange={(e) => this.setState({ formAggEC: e.target.value })}
                type="number"
                step=".01"
                placeholder="EC"
              />
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="formAggEF">
              <Form.Label>EF</Form.Label>
              <Form.Control
                value={this.state.formAggEF}
                onChange={(e) => this.setState({ formAggEF: e.target.value })}
                type="number"
                step=".01"
                placeholder="EF"
              />
            </Form.Group>
          </Form.Row>
        </div>
      );
    } else if (AggStruc === "2-Tier") {
      return (
        <div>
          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formAggEE">
              <Form.Label>EE</Form.Label>
              <Form.Control
                value={this.state.formAggEE}
                onChange={(e) => this.setState({ formAggEE: e.target.value })}
                type="number"
                step=".01"
                placeholder="EE"
              />
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="formAggEF">
              <Form.Label>EF</Form.Label>
              <Form.Control
                value={this.state.formAggEF}
                onChange={(e) => this.setState({ formAggEF: e.target.value })}
                type="number"
                step=".01"
                placeholder="EF"
              />
            </Form.Group>
          </Form.Row>
        </div>
      );
    } else if (AggStruc === "1-Tier") {
      return (
        <div>
          <Form.Row className="MyFormRow">
            <Form.Group as={Col} md="3" controlId="formAggEF">
              <Form.Label>Comp</Form.Label>
              <Form.Control
                value={this.state.formAggEF}
                onChange={(e) => this.setState({ formAggEF: e.target.value })}
                type="number"
                step=".01"
                placeholder="Comp"
              />
            </Form.Group>
          </Form.Row>
        </div>
      );
    }
    return;
  };

  autoFillFromExcel = async (xlsxfile) => {
    // Invokes parser in main electron app
    const result = await ipcRenderer.invoke("readExcel", xlsxfile);
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
    this.setState({
      formMGU: result.MGU,
      formCarrier: result.Carrier,
      formNetwork: result.Network,
      formAdminTPA: result.Admin,
      formMIC: result.MIC,
      formStartDate: result.StartDate,
    });

    // Sets the Start Date as an epoch if it was found
    try {
      const startDate = new Date(result.StartDate);
      if (startDate.getTime()) {
        this.setState({ formStartDate: startDate.getTime() });
      }
    } catch (err) {
      console.log(err);
    }

    // Sets Specific Rates if they were found
    try {
      if (censusResult[5]) {
        this.setState({ SpecStruc: "1-Tier", formSpecEF: censusResult[5] });
      } else if (censusResult[4]) {
        this.setState({
          SpecStruc: "2-Tier",
          formSpecEF: censusResult[4],
          formSpecEE: censusResult[0],
        });
      } else if (censusResult[3]) {
        this.setState({
          SpecStruc: "2-Tier",
          formSpecEE: censusResult[0],
          formSpecEC: censusResult[1],
          formSpecES: censusResult[2],
          formSpecEF: censusResult[3],
        });
      }
    } catch (err) {
      console.log(err);
    }

    // Sets Aggregate Composite Rate if it was found
    try {
      if (censusResult[6]) {
        this.setState({ formAggEF: censusResult[6] });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { show, onHide, tabState } = this.props;

    return (
      <Modal
        show={show}
        onHide={onHide}
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
          <Form>
            <Form.Group controlId="formMGU">
              <Form.Label>MGU</Form.Label>
              <Form.Control
                value={this.state.formMGU}
                onChange={(e) => this.setState({ formMGU: e.target.value })}
                type="text"
                placeholder="MGU"
              />
            </Form.Group>

            <Form.Group controlId="formCarrier">
              <Form.Label>Carrier</Form.Label>
              <Form.Control
                value={this.state.formCarrier}
                onChange={(e) => this.setState({ formCarrier: e.target.value })}
                type="text"
                placeholder="Carrier"
              />
            </Form.Group>

            <Form.Group controlId="formNetwork">
              <Form.Label>Network</Form.Label>
              <Form.Control
                value={this.state.formNetwork}
                onChange={(e) => this.setState({ formNetwork: e.target.value })}
                type="text"
                placeholder="Network"
              />
            </Form.Group>

            <Form.Group controlId="formAdminTPA">
              <Form.Label>Administrator/TPA</Form.Label>
              <Form.Control
                value={this.state.formAdminTPA}
                onChange={(e) =>
                  this.setState({ formAdminTPA: e.target.value })
                }
                type="text"
                placeholder="Admin or TPA"
              />
            </Form.Group>

            <Form.Group controlId="formMIC">
              <Form.Label>Months in Contract</Form.Label>
              <Form.Control
                value={this.state.formMIC}
                onChange={(e) => this.setState({ formMIC: e.target.value })}
                type="number"
                placeholder="In Months"
              />
            </Form.Group>

            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                value={myDate(this.state.formStartDate, true)}
                onChange={(e) => {
                  const formStartDate = myTime(e.target.value);
                  this.setState({ formStartDate });
                }}
                type="date"
                placeholder="Month YYYY"
              />
            </Form.Group>

            <h4>Premium Rates</h4>

            <Form.Group controlId="tierStructure">
              <Form.Label>Specific Rate Structure</Form.Label>
              <Form.Control
                value={this.state.SpecStruc}
                onChange={(e) => this.setState({ SpecStruc: e.target.value })}
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

            {this.renderSpecRates()}

            <Form.Group controlId="tierStructure">
              <Form.Label>Aggregate Rate Structure</Form.Label>
              <Form.Control
                value={this.state.AggStruc}
                onChange={(e) => this.setState({ AggStruc: e.target.value })}
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

            {this.renderAggRates()}

            <h4>Premium Fees</h4>
            {this.renderPremiumFees()}

            <h4>Vendor Fees</h4>

            {this.renderVendorFees()}

            <h4>Source</h4>
            <Form.Group>
              <Form.File
                custom
                id="excelFile"
                label={this.state.excelLabel}
                data-browse="Select File"
                type="file"
                accept=".xlsx"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    this.setState({
                      excelfile: e.target.files[0],
                      loadButton: 0,
                      newsource: e.target.files[0].name,
                      excelLabel: e.target.files[0].name,
                    });
                  } else {
                    if (this.state.source) {
                      this.setState({
                        excelfile: "",
                        loadButton: 1,
                        newsource: "",
                        excelLabel: this.state.source,
                      });
                    } else {
                      this.setState({
                        excelfile: "",
                        loadButton: 1,
                        newsource: "",
                        excelLabel: "Excel (.xlsx) File",
                      });
                    }
                  }
                }}
              ></Form.File>
            </Form.Group>

            <Form.Row>
              <div className="MyFormButton">
                <Button
                  onClick={() => {
                    this.props.onPolicySubmit(tabState[2], this.state);
                  }}
                  variant="primary"
                >
                  Submit
                </Button>
              </div>
              <div className="MyFormButton">
                <Button
                  onClick={() =>
                    this.autoFillFromExcel(this.state.excelfile.path)
                  }
                  variant="primary"
                  disabled={this.state.loadButton}
                >
                  Load
                </Button>
              </div>
            </Form.Row>
          </Form>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }
}

export default PolicyModal;
