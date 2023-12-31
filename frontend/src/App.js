import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { loginSuccess } from './redux/features/auth';
import { setUserData } from './redux/features/userinfo';
import axios from 'axios';

// Import components and pages
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';
import Destination from './pages/Destination/Destination';
import Dashboard from './pages/Deshboard/Dashboard';
import ContactUs from './pages/Contact/ContactUs';
import PlannedTrip from './pages/PlannedTrip/PlannedTrip';
import Search from './pages/Search/Search';
import { getUser } from './utils/APIRoutes'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (userData) {
      let userDataJSON = JSON.parse(userData)
      dispatch(loginSuccess(userDataJSON));
      
      axios.get(`${getUser}${userDataJSON._id}`)
        .then(function (response) {
          const apiResponseData = response.data;
          console.log(apiResponseData)
          dispatch(setUserData(apiResponseData));
        })
        .catch(function (error) {
          console.log(error);
        });

    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/destination/:id" element={<Destination />} />
        <Route path="/tripplan" element={<PlannedTrip />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
