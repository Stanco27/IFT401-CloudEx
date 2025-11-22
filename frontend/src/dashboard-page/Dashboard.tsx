import { Card, Container } from "react-bootstrap";
import Stocks from "../stocks/Stocks";
import DashboardPortfolio from "../portfolio/DashboardPortfolio";

const Dashboard = () => {
  // Once API is integrated, replace this static data with dynamic data from the API
  const loserStocks = [
    {
      currentPrice: 100.11,
      previousPrice: 98.11,
      companyName: "Apple Inc.",
      stockName: "AAPL",
      companyImage: "https://cdn-icons-png.freepik.com/512/5969/5969046.png",
    },
    {
      currentPrice: 10.11,
      previousPrice: 98.11,
      companyName: "Apple Inc.",
      stockName: "AAPL",
      companyImage: "https://cdn-icons-png.freepik.com/512/5969/5969046.png",
    },
    {
      currentPrice: 100.11,
      previousPrice: 98.11,
      companyName: "Apple Inc.",
      stockName: "AAPL",
      companyImage: "https://cdn-icons-png.freepik.com/512/5969/5969046.png",
    },
  ];

  const gainersStocks = [
    {
      currentPrice: 150.11,
      previousPrice: 98.11,
      companyName: "Microsoft Corp.",
      stockName: "MSFT",
      companyImage: "https://cdn-icons-png.freepik.com/512/5969/5969046.png",
    },
    {
      currentPrice: 200.11,
      previousPrice: 98.11,
      companyName: "Microsoft Corp.",
      stockName: "MSFT",
      companyImage: "https://cdn-icons-png.freepik.com/512/5969/5969046.png",
    },
    {
      currentPrice: 250.11,
      previousPrice: 98.11,
      companyName: "Microsoft Corp.",
      stockName: "MSFT",
      companyImage: "https://cdn-icons-png.freepik.com/512/5969/5969046.png",
    },
  ];

  const accountBalance = 5000.0;
  const totalPortfolioValue = 15000.0;
  const dailyChange = 200.0;
  const percentageChange =
    (dailyChange / (totalPortfolioValue - dailyChange)) * 100;

  return (
    <Container className="p-0">
      <DashboardPortfolio
        accountBalance={accountBalance}
        totalPortfolioValue={totalPortfolioValue}
        dailyChange={dailyChange}
        percentageChange={percentageChange}
      />
      <Card className="p-3 m-2 my-4">
        <h5>Top Losers</h5>
      {loserStocks.map((stock, index) => (
        <Stocks
        key={index}
        isLast={index === loserStocks.length - 1}
        currentPrice={stock.currentPrice}
        previousPrice={stock.previousPrice}
        companyName={stock.companyName}
        stockName={stock.stockName}
        companyImage={stock.companyImage}
        />
      ))}
      </Card>
      <Card className="p-3 m-2 my-4">
        <h5>Top Gainers</h5>
      {gainersStocks.map((stock, index) => (
        <Stocks
        key={index}
        isLast={index === gainersStocks.length - 1}
        currentPrice={stock.currentPrice}
        previousPrice={stock.previousPrice}
        companyName={stock.companyName}
        stockName={stock.stockName}
        companyImage={stock.companyImage}
        />
      ))}
      </Card>
    </Container>
  );
};

export default Dashboard;
