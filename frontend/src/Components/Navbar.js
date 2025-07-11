import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Expense Tracker</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/income">Income</Link>
        <Link to="/history">Transaction History</Link>
        <Link to="/charts">Chart</Link>
      </div>
    </nav>
  );
}

export default Navbar;
