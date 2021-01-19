import "./mystyles.css";

function CustomerNavBarButton(props) {
  const {
    tabState,
    showCensusModal,
    showPolicyModal,
    showInvoiceModal,
  } = props;
  if (tabState[1] === ".policies") {
    return (
      <li className="nav-item ml-auto">
        <button
          className="btn btn-primary MyNavBarButton"
          onClick={showPolicyModal}
        >
          New
        </button>
      </li>
    );
  } else if (tabState[1] === ".census") {
    return (
      <li className="nav-item ml-auto">
        <button
          className="btn btn-primary MyNavBarButton"
          onClick={showCensusModal}
        >
          New
        </button>
      </li>
    );
  } else if (tabState[1] === ".invoices") {
    return (
      <li className="nav-item ml-auto">
        <button
          className="btn btn-primary MyNavBarButton"
          onClick={showInvoiceModal}
        >
          New
        </button>
      </li>
    );
  }
  return;
}

export const CustomersNav = (props) => {
  let navLink = "nav-link ";
  const { onTabContent, tabState } = props;
  var actionsClass =
    tabState[1] === ".actions" ? navLink + "active" : navLink + "";
  var customersClass =
    tabState[1] === ".customers" ? navLink + "active" : navLink + "";
  return (
    <div className="MyNavBar">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={actionsClass}
            onClick={() => onTabContent("customerTab", [".a", ".actions", ""])}
          >
            Actions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={customersClass}
            onClick={() =>
              onTabContent("customerTab", [".a", ".customers", ""])
            }
          >
            Customers
          </button>
        </li>
      </ul>
    </div>
  );
};

export const CustomerNav = (props) => {
  let navLink = "nav-link ";
  const { onTabContent, tabState } = props;
  var actionsClass =
    tabState[1] === ".actions" ? navLink + "active" : navLink + "";
  var invoicesClass =
    tabState[1] === ".invoices" ? navLink + "active" : navLink + "";
  var policiesClass =
    tabState[1] === ".policies" ? navLink + "active" : navLink + "";
  var censusClass =
    tabState[1] === ".census" ? navLink + "active" : navLink + "";
  return (
    <div className="MyNavBar">
      <h1>{tabState[2]}</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={actionsClass}
            onClick={() =>
              onTabContent("customerTab", [".b", ".actions", tabState[2]])
            }
          >
            Actions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={invoicesClass}
            onClick={() =>
              onTabContent("customerTab", [".b", ".invoices", tabState[2]])
            }
          >
            Invoices
          </button>
        </li>
        <li className="nav-item">
          <button
            className={policiesClass}
            onClick={() =>
              onTabContent("customerTab", [".b", ".policies", tabState[2]])
            }
          >
            Policies
          </button>
        </li>
        <li className="nav-item">
          <button
            className={censusClass}
            onClick={() =>
              onTabContent("customerTab", [".b", ".census", tabState[2]])
            }
          >
            Census
          </button>
        </li>
        <li className="nav-item">
          <button
            className={navLink}
            onClick={() =>
              onTabContent("customerTab", [".a", ".customers", ""])
            }
          >
            Back
          </button>
        </li>
        {CustomerNavBarButton(props)}
      </ul>
    </div>
  );
};

export const VendorsNav = (props) => {
  let navLink = "nav-link ";
  const { onTabContent, tabState } = props;
  var actionsClass =
    tabState[1] === ".actions" ? navLink + "active" : navLink + "";
  var vendorsClass =
    tabState[1] === ".vendors" ? navLink + "active" : navLink + "";

  return (
    <div className="MyNavBar">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={actionsClass}
            onClick={() => onTabContent("vendorTab", [".a", ".actions", ""])}
          >
            Actions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={vendorsClass}
            onClick={() => onTabContent("vendorTab", [".a", ".vendors", ""])}
          >
            Vendors
          </button>
        </li>
      </ul>
    </div>
  );
};

export const VendorNav = (props) => {
  let navLink = "nav-link ";
  const { onTabContent, tabState } = props;
  var actionsClass =
    tabState[1] === ".actions" ? navLink + "active" : navLink + "";

  var invoicesClass =
    tabState[1] === ".bills" ? navLink + "active" : navLink + "";
  var censusClass =
    tabState[1] === ".census" ? navLink + "active" : navLink + "";
  return (
    <div className="MyNavBar">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={actionsClass}
            onClick={() =>
              onTabContent("vendorTab", [".b", ".actions", tabState[2]])
            }
          >
            Actions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={invoicesClass}
            onClick={() =>
              onTabContent("vendorTab", [".b", ".bills", tabState[2]])
            }
          >
            Bills
          </button>
        </li>
        <li className="nav-item">
          <button
            className={censusClass}
            onClick={() =>
              onTabContent("vendorTab", [".b", ".census", tabState[2]])
            }
          >
            Census
          </button>
        </li>
        <li className="nav-item">
          <button
            className={navLink}
            onClick={() => onTabContent("vendorTab", [".a", ".actions", ""])}
          >
            Back
          </button>
        </li>
      </ul>
    </div>
  );
};
