import './App.css';
import UserHeader from './components/UserHeader.js'
import HomeHeader from './components/HomeHeader.js'
function App() {
  return (
    <div className="App">
      <div className = "header">
          <HomeHeader/>
      </div>
      <h1>Home Page</h1>
    </div>
  );
}

export default App;
