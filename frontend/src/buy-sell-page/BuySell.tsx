import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Card, Form, InputGroup, ListGroup } from 'react-bootstrap';

const ALL_STOCK_SYMBOLS: string[] = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'JPM', 'JNJ', 'V', 'PG', 'MA', 'HD', 'DIS', 'NFLX', 'PYPL'];

const BuySell: React.FC = () => {
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
  const [shares, setShares] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const maxShares: number = 150;

  const isBuying: boolean = action === 'BUY';
  const isSelling: boolean = action === 'SELL';
  const buttonVariant: 'success' | 'danger' = isBuying ? 'success' : 'danger';
  const buttonText: string = isBuying ? 'Confirm Buy' : 'Confirm Sell';

  const handleSymbolChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value.toUpperCase();
    setSymbol(value);

    if (value.length > 0) {
      const filteredSuggestions: string[] = ALL_STOCK_SYMBOLS.filter((sym: string) =>
        sym.startsWith(value)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setSuggestions([]);
  };

  const handleAllShares = () => {
    if (isSelling) {
      setShares(maxShares.toString());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Action: ${action}, Symbol: ${symbol}, Shares: ${shares}`);
  };

  return (
    <Card className="p-3 m-3">
      <Card.Body>
        <Card.Title className="mb-4">Trade Stock</Card.Title>
        
        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3" controlId="formActionSelect">
            <Form.Label>Select Action</Form.Label>
            <Form.Select 
              aria-label="Select Buy or Sell action"
              value={action}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setAction(e.target.value as 'BUY' | 'SELL');
                setShares(''); 
              }}
              className={isBuying ? 'border-success' : 'border-danger'}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3 position-relative" controlId="formStockSymbol">
            <Form.Label>Stock Symbol</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter stock symbol" 
              value={symbol}
              onChange={handleSymbolChange}
              autoComplete="off"
            />
            
            {suggestions.length > 0 && (
              <ListGroup className="suggestions-list position-absolute w-100" style={{ zIndex: 1000 }}>
                {suggestions.map((sym: string) => (
                  <ListGroup.Item 
                    key={sym} 
                    action 
                    onClick={() => selectSuggestion(sym)}
                  >
                    {sym}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formShares">
            <Form.Label>Number of Shares</Form.Label>
            <InputGroup>
              <Form.Control 
                type="number" 
                placeholder="Enter number of shares" 
                min="1"
                max={isSelling ? maxShares : undefined} 
                value={shares}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setShares(e.target.value)}
              />
              
              {isSelling && (
                <Button 
                  variant="outline-danger" 
                  onClick={handleAllShares}
                  disabled={shares === maxShares.toString()} 
                >
                  All Shares ({maxShares})
                </Button>
              )}
            </InputGroup>
            {isSelling && <Form.Text className="text-muted">You own up to {maxShares} shares.</Form.Text>}
          </Form.Group>
          
          <Button 
            variant={buttonVariant} 
            type="submit" 
            className="w-100 mt-3"
            disabled={!symbol || !shares || parseFloat(shares) <= 0} 
          >
            {buttonText}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BuySell;