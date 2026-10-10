import './App.css';
import { Routes, Route } from 'react-router-dom';
import routes from './route/Route';

function App() {
  return (
    <div className="App">
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;