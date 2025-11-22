import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './dashboard-page/Dashboard'
import BuySell from './buy-sell-page/BuySell'
import Transactions from './transactions-page/TransactionsPage'
import HomePage from './home-page/HomePage'
import SignUp from './sign-up/SignUp'
import SignIn from './sign-in/SignIn'
import ResetPassword from './resest-password/ResetPassword'

const RouteComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/Home" element={<HomePage/>} />
      <Route path="/Dashboard" element={ <Dashboard />} />
      <Route path="/Buy-Sell" element={<BuySell />} />
      <Route path="/Transactions" element={<Transactions />} />
      <Route path="/Sign-In" element={<SignIn />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      <Route path="/Reset-Password" element={<ResetPassword />} />
    </Routes>
  )
}

export default RouteComponent