import React from 'react'
import { Card } from 'react-bootstrap';

interface DashboardPortfolioProps {
    accountBalance: number;
    totalPortfolioValue: number;
    dailyChange: number;
    percentageChange: number;
}

const DashboardPortfolio:React.FC<DashboardPortfolioProps> = ({accountBalance, totalPortfolioValue, dailyChange, percentageChange}) => {
  return (
    <Card className='p-2 mx-2 my-4'>
        <Card.Body>
            <Card.Title>Portfolio Summary</Card.Title>
            <Card.Text>
                <strong>Account Balance:</strong> ${accountBalance.toFixed(2)}
            </Card.Text>
            <Card.Text>
                <strong>Total Portfolio Value:</strong> ${totalPortfolioValue.toFixed(2)}
            </Card.Text>
            <Card.Text>
                <strong>Daily Change:</strong> ${dailyChange.toFixed(2)} ({percentageChange.toFixed(2)}%)
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default DashboardPortfolio