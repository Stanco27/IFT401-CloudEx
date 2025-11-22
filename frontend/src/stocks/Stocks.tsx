import React from "react";
import "./Stocks.css";
import { Col, Container, Row } from "react-bootstrap";

interface StockProps {
    isLast?: boolean;
    currentPrice: number;
    previousPrice: number;
    companyName: string;
    stockName: string;
    companyImage: string;
}

const Stocks: React.FC<StockProps> = ({isLast, currentPrice, previousPrice,  companyName, companyImage, stockName}) => {
  const diff = currentPrice - previousPrice;
  const symbol = diff > 0 ? "+" : "";

  return (
    <Container className={isLast ? "pb-2 mb-2" : "stocks-border pb-2 mb-2"} onClick={() => alert(`Clicked on ${companyName}`)}>
      <Row>
        <Col xs={2}>
          <img
            src={companyImage}
            className="stocks-img"
          />
        </Col>
        <Col xs={6}>
          <h6 className="m-0">{companyName}</h6>
          <h6 className="m-0">{stockName}</h6>
        </Col>
        <Col xs={4} className="text-end">
          <h6 className="m-0">${currentPrice.toFixed(2)}</h6>
          <h6
            className={
              diff < 0
                ? "negative-price"
                : diff > 0
                ? "positive-price"
                : "neutral-price"
            }
          >
            {symbol}{diff.toFixed(2)} ({((diff / previousPrice) * 100).toFixed(2)}%)
          </h6>
        </Col>
      </Row>
    </Container>
  );
};

export default Stocks;
