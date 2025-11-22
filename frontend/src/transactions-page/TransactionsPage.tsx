import React from 'react'
import Transactions from './Transactions'



const TransactionsPage = () => {

const shares = [{date: '2023-10-01', type: 'Buy', stockName: 'Apple Inc.', stockSymbol: 'AAPL', shares: 10, pricePerShare: 150, totalAmount: 1500},
{date: '2023-10-05', type: 'Sell', stockName: 'Microsoft Corp.', stockSymbol: 'MSFT', shares: 5, pricePerShare: 200, totalAmount: 1000},
{date: '2023-10-10', type: 'Buy', stockName: 'Tesla Inc.', stockSymbol: 'TSLA', shares: 8, pricePerShare: 300, totalAmount: 2400}];

  return (
    shares.map((share, index) => (
        <Transactions 
        key={index}
        date={share.date}
        type={share.type}
        stockName={share.stockName}
        stockSymbol={share.stockSymbol}
        shares={share.shares}
        pricePerShare={share.pricePerShare}
        totalAmount={share.totalAmount}
        />
    ))
  )
}

export default TransactionsPage