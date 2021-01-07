import "./mystyles.css";

function NavBarButton(props) {
    const { onModalShow, tabState } = props;
    if (tabState[1] === ".policies" || tabState[1] === ".census") {
        return (<li className="nav-item ml-auto" >
        <button className="btn btn-primary MyNavBarButton" onClick={() => onModalShow(tabState[1], true)}>New</button>
            </li>
        )
    } 
    return
}

export const CustomersNav = (props) => {
    const {onTabContent, tabState, navLink} = props;
    var actionsClass = tabState[1] === ".actions" ? navLink + "active" : navLink + "";
    var customersClass = tabState[1] === ".customers" ? navLink + "active" : navLink + "";
    return (
        <div className="MyNavBar">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className={actionsClass} onClick={() => onTabContent("customerTab", [".a", ".actions", ""])} >Actions</button>
                </li>
                <li className="nav-item" >
                    <button className={customersClass} onClick={() => onTabContent("customerTab", [".a", ".customers", ""])} >Customers</button>
                </li>
            </ul>
        </div>
    );
}

export const CustomerNav = (props) => {
    const {onTabContent, tabState, navLink} = props;
    var actionsClass = tabState[1] === ".actions" ? navLink + "active" : navLink + "";
    var invoicesClass = tabState[1] === ".invoices" ? navLink + "active" : navLink + "";
    var policiesClass = tabState[1] === ".policies" ? navLink + "active" : navLink + "";
    var censusClass = tabState[1] === ".census" ? navLink + "active" : navLink + "";
    return (
        <div className="MyNavBar">
            <h1>{tabState[2]}</h1>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className={actionsClass} onClick={() => onTabContent("customerTab", [".b", ".actions", tabState[2]])} >Actions</button>
                </li>
                <li className="nav-item" >
                    <button className={invoicesClass} onClick={() => onTabContent("customerTab", [".b", ".invoices", tabState[2]])} >Invoices</button>
                </li>
                <li className="nav-item" >
                    <button className={policiesClass} onClick={() => onTabContent("customerTab", [".b", ".policies", tabState[2]])} >Policies</button>
                </li>
                <li className="nav-item" >
                    <button className={censusClass} onClick={() => onTabContent("customerTab", [".b", ".census", tabState[2]])} >Census</button>
                </li>
                <li className="nav-item" >
                    <button className={navLink} onClick={() => onTabContent("customerTab", [".a", ".customers", ""])} >Back</button>
                </li>
                {NavBarButton(props)}
            </ul>
        </div>
    );
}

export const VendorsNav = (props) => {
    return (<h1>Hello</h1>);
}

export const VendorNav = (props) => {
    return (<h1>Hello</h1>);
}

