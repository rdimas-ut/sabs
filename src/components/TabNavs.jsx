import "./mystyles.css";

export const CustomersNav = (props) => {
  let navLink = "nav-link ";
  const { onTabContent, tabState } = props;
  var customersClass =
    tabState[1] === "customers" ? navLink + "active" : navLink + "";
  return (
    <div className="MyNavBar">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={customersClass}
            onClick={() => onTabContent("customersTab", ["a", "customers", ""])}
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
  const {
    onTabContent,
    tabState,
    showCensusModal,
    showPolicyModal,
    showInvoiceModal,
  } = props;

  var invoicesClass =
    tabState[1] === "invoices" ? navLink + "active" : navLink + "";
  var policiesClass =
    tabState[1] === "policies" ? navLink + "active" : navLink + "";
  var censusClass =
    tabState[1] === "census" ? navLink + "active" : navLink + "";
  return (
    <div className="MyNavBar">
      <h1>{tabState[2]}</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={invoicesClass}
            onClick={() =>
              onTabContent("customersTab", ["b", "invoices", tabState[2]])
            }
          >
            Invoices
          </button>
        </li>
        <li className="nav-item">
          <button
            className={policiesClass}
            onClick={() =>
              onTabContent("customersTab", ["b", "policies", tabState[2]])
            }
          >
            Policies
          </button>
        </li>
        <li className="nav-item">
          <button
            className={censusClass}
            onClick={() =>
              onTabContent("customersTab", ["b", "census", tabState[2]])
            }
          >
            Census
          </button>
        </li>
        <li className="nav-item">
          <button
            className={navLink}
            onClick={() => onTabContent("customersTab", ["a", "customers", ""])}
          >
            Back
          </button>
        </li>

        {tabState[1] === "policies" && (
          <li className="nav-item ml-auto">
            <button
              className="btn btn-primary MyNavBarButton"
              onClick={showPolicyModal}
            >
              New
            </button>
          </li>
        )}
        {tabState[1] === "census" && (
          <li className="nav-item ml-auto">
            <button
              className="btn btn-primary MyNavBarButton"
              onClick={showCensusModal}
            >
              New
            </button>
          </li>
        )}
        {tabState[1] === "invoices" && (
          <li className="nav-item ml-auto">
            <button
              className="btn btn-primary MyNavBarButton"
              onClick={showInvoiceModal}
            >
              New
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export const VendorsNav = (props) => {
  let navLink = "nav-link ";
  var vendorsClass =
    props.tabState[1] === "vendors" ? navLink + "active" : navLink + "";

  return (
    <div className="MyNavBar">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={vendorsClass}
            onClick={() => {
              props.onTabContent("vendorsTab", ["a", "vendors", ""]);
            }}
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
  var invoicesClass =
    props.tabState[1] === "bills" ? navLink + "active" : navLink + "";
  return (
    <div className="MyNavBar">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={invoicesClass}
            onClick={() => {
              props.onTabContent("vendorsTab", [
                "b",
                "bills",
                props.tabState[2],
              ]);
            }}
          >
            Bills
          </button>
        </li>
        <li className="nav-item">
          <button
            className={navLink}
            onClick={() => {
              props.onTabContent("vendorsTab", ["a", "vendors", ""]);
            }}
          >
            Back
          </button>
        </li>
      </ul>
    </div>
  );
};
