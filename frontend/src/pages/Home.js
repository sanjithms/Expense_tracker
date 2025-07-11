import '../styles/Home.css';
import { Link } from "react-router-dom";
const Home = () => {

 
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to <span>Expense Tracker</span></h1>
        <p>Track your income and expenses, analyze your spending, and take control of your financial life.</p>
        <Link to="/expenses" className="home-btn">Get Started</Link>
      </div>
      <div className="home-image">
        <img src="https://img.freepik.com/free-vector/budget-planning-concept-illustration_114360-7654.jpg" alt="Budget" />
      </div>
    </div>
  );
}
export default Home;