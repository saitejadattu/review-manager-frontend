import Login from './components/Login';
import Register from './components/Register';
import ProductCards from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './components/ProductDetailView';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Login />} path='/login' />
        <Route path='/register' element={<Register />} />
        <Route element={< ProtectedRoute />} >
          <Route path='/' element={<ProductCards />} />
          <Route path='/product/:id' element={<ProductDetail />} />
        </Route>
        <Route path='*' element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router >
  );
}

export default App;

