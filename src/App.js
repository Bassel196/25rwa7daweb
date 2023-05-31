import logo from './logo.svg';
import './App.css';
import Navbaar from './components/header/Navbaar';
import Footer from './components/footer/Footer';
import Newnav from './components/newnavbaar/Newnav';
import Maincomp from './components/home/Maincomp';
import Signup from './components/signup_signin/SignUp';
import Sign_in from './components/signup_signin/Sign_in';
import Cart from './components/cart/Cart';
import Buynow from './components/buynow/Buynow';
import './App.css';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Switch, Route, Routes } from "react-router-dom";

function App() {
  const [data, setData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 2000);
  }, [])


  return (
    <>
    <Navbaar />
    <Newnav />
    <Routes>
      <Routes path="/" element={<Maincomp />} />
      <Routes path="/login" element={<Sign_in />} />
      <Routes path="/register" element={<Signup />} />
      <Routes path="/getproductsone" element={<Cart />} />
      <Routes path="/buynow" element={<Buynow />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App;
