import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Shop from './components/Shop';
import ShoppingCart from './components/cart/ShoppingCart';
import Checkoutitem from './components/Checkoutitem';
import Checkoutitem2 from './components/Checkoutitem2';
import AddProducts from './components/AddProducts';
import EditProfile from './components/EditProfile';
import OrderHistory from './components/OrderHistory';
import Shipping from './components/Shipping';
import Admin from './components/Admin';
import { GiShoppingBag } from "react-icons/gi";
import './App.css';

const App = () => {
  const [cartsVisibility, setCartVisible] = useState(false);
  const [updatedPrice, setUpdatedPrice] = useState([]);

  const token = localStorage.getItem('token');
  const usertype = localStorage.getItem('usertype');
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('iduser');
    localStorage.removeItem('id_user');
    localStorage.removeItem('shopping-cart');
    localStorage.removeItem('usertype');
    window.location = '/login';
  }

  const onOpenCart = () => {
    setCartVisible(true);
  };

  const onQuantityChange = (productId, count) => {
    const iduser = localStorage.getItem('iduser');
    const updateData = {
      id_item: productId,
      id_user: iduser,
      order_count: count,
    };
    
    fetch(`http://chaibwoot.no-ip.org:4452/updateitem/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUpdatedPrice(prevValue => !prevValue);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <Router>
      <div>
      <ShoppingCart
        visibilty={cartsVisibility}
        onClose={() => setCartVisible(false)}
        onQuantityChange={onQuantityChange}
        updatedPrice={updatedPrice}
      />
        <nav>
          <ul>
            {token && usertype === 'user' && (
              <>
                <li><Link to="/">Shop</Link></li>
                <li><Link to="/about">How to order</Link></li>
                <li><Link to="/editprofile">EditProfile</Link></li>
                <li><Link to="/orderhistory">Order history</Link></li>
                <li onClick={handleLogout}><Link to="/login">Logout</Link></li>
                <button className="btn shopping-cart-btn" onClick={onOpenCart}>
                  <GiShoppingBag size={24} />
                </button>
              </>
            )}
            {token && usertype === 'admin' && (
              <>
                <li><Link to="/">Shop</Link></li>
                <li><Link to="/about">How to order</Link></li>
                <li><Link to="/editprofile">EditProfile</Link></li>
                <li><Link to="/addproducts">Add Products</Link></li>
                <li><Link to="/admin">Admin</Link></li>
                <li><Link to="/shipped">Shipped</Link></li>
                <li onClick={handleLogout}><Link to="/login">Logout</Link></li>
                <button className="btn shopping-cart-btn" onClick={onOpenCart}>
                  <GiShoppingBag size={24} />
                </button>
              </>
            )}
            {!token && (
              <>
                <li><Link to="/">Shop</Link></li>
                <li><Link to="/about">How to order</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </nav>

        {/* Use Routes to define your routes */}
        <Routes>
        <Route path="/" element={<Shop onOpenCart={onOpenCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkoutitem" element={<Checkoutitem />} />
          <Route path="/checkoutitem2" element={<Checkoutitem2 />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/addproducts" element={<AddProducts />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/shipped" element={<Shipping />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
