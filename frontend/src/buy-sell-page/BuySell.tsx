import React, { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { Button, Card, Form, InputGroup, ListGroup, Col, Row, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { searchStocks, getTotalShares, getStockId, buy_sellStock } from '../Api';

interface StockSearchResult {
    stock_id: string;
    symbol: string;
}

interface TransactionData { 
    user_id: string; 
    stock_id: string; 
    shares: number; 
    price_per_share: number; 
    fee_amount: number; 
    transaction_type: 'BUY' | 'SELL'; 
}


const getUserId = (): string => {
    const id = localStorage.getItem('user_id');
    if (!id) throw new Error("User ID not found in localStorage.");
    return id;
};

const BuySell: React.FC = () => {
    const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
    const [shares, setShares] = useState<string>('0');
    const [symbol, setSymbol] = useState<string>('');
    const [suggestions, setSuggestions] = useState<StockSearchResult[]>([]);
    const [transactionStatus, setTransactionStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [message, setMessage] = useState<string | null>(null);
    const [userShares, setUserShares] = useState<number | null>(null);
    const [isFetchingShares, setIsFetchingShares] = useState<boolean>(false);

    const [searchParams] = useSearchParams();

    const isBuying = action === 'BUY';
    const isSelling = action === 'SELL';
    const maxShares = userShares ?? 0;
    const buttonVariant: 'success' | 'danger' = isBuying ? 'success' : 'danger';
    const buttonText = isBuying ? 'Confirm Buy' : 'Confirm Sell';
    
    const isDisabled =
        !symbol ||
        !shares ||
        parseFloat(shares) <= 0 ||
        transactionStatus === 'LOADING' ||
        isFetchingShares ||
        (isSelling && parseFloat(shares) > maxShares);

    useEffect(() => {
        const querySymbol = searchParams.get('symbol');
        if (querySymbol) {
            setSymbol(querySymbol.toUpperCase());
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!symbol || symbol.length >= 4) return setSuggestions([]);
            
            if (transactionStatus === 'SUCCESS') return;

            try {
                const results = await searchStocks(symbol);
                if (Array.isArray(results)) {
                    const mapped = results.map((item: any[]) => ({ stock_id: item[0], symbol: item[1] }));
                    setSuggestions(mapped);
                } else setSuggestions([]);
            } catch {
                setSuggestions([]);
            }
        };
        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [symbol, transactionStatus]);

    useEffect(() => {
        let isMounted = true;
        const fetchUserShares = async () => {
            if (isSelling && symbol.length >= 1 && symbol.length <= 5) {
                setIsFetchingShares(true);
                try {
                    const stockInfo = await getStockId(symbol);
                    const sharesResp = await getTotalShares(getUserId(), stockInfo.stock_id);
                    if (isMounted) {
                        setUserShares(Number(parseFloat(sharesResp.shares_owned).toFixed(2)));
                    }
                } catch {
                    if (isMounted) setUserShares(0);
                } finally {
                    if (isMounted) setIsFetchingShares(false);
                }
            }
        };
        fetchUserShares();
        return () => { isMounted = false; }
    }, [symbol, action, isSelling]);

    const handleSymbolChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (transactionStatus === 'SUCCESS') setTransactionStatus('IDLE');
        
        setMessage(null);
        const val = e.target.value.toUpperCase();
        if (val.length <= 5 && /^[A-Z]*$/.test(val)) setSymbol(val);
    };

    const selectSuggestion = (s: StockSearchResult) => {
        setSymbol(s.symbol);
        setSuggestions([]);
    };

    const handleAllShares = () => {
        if (userShares !== null) setShares(userShares.toString());
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const numShares = parseFloat(shares);
        if (!symbol || numShares <= 0 || (isSelling && numShares > maxShares)) {
            setTransactionStatus('ERROR');
            setMessage(`Invalid input. You only own ${maxShares} shares.`);
            return;
        }

        setTransactionStatus('LOADING');
        setMessage(`Processing ${action} order...`);

        try {
            const stockInfo = await getStockId(symbol);
            const data: TransactionData = {
                user_id: getUserId(),
                stock_id: stockInfo.stock_id,
                shares: numShares,
                price_per_share: stockInfo.price_per_share,
                fee_amount: 0,
                transaction_type: action
            };
            
            const result = await buy_sellStock(data);
            
            if (result.status === 'success') {
                setTransactionStatus('SUCCESS');
                setMessage(result.message || 'Transaction completed!');
                
                setShares('0');
                setSymbol('');
                setSuggestions([]);
                setUserShares(null);
            } else {
                setTransactionStatus('ERROR');
                setMessage(result.message || 'Transaction failed');
            }
        } catch {
            setTransactionStatus('ERROR');
            setMessage('Insufficient funds or an error occurred during the transaction.');
        }
    };

    return (
        <div className="d-flex justify-content-center m-3">
            <Card 
                className={`p-3 w-100 shadow-lg rounded-xl ${transactionStatus === 'SUCCESS' ? 'border border-success border-3' : ''}`} 
                style={{ maxWidth: '500px' }}
            >
                <Card.Body>
                    <Card.Title className="mb-4 text-center font-bold text-xl">Trade Stock</Card.Title>

                    {message && (
                        <Alert variant={transactionStatus === 'SUCCESS' ? 'success' : 'danger'} className="rounded-lg">
                            {message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Action</Form.Label>
                                    <Form.Select
                                        value={action}
                                        onChange={e => { 
                                            setAction(e.target.value as 'BUY' | 'SELL'); 
                                            setShares('0'); 
                                            setTransactionStatus('IDLE'); 
                                            setMessage(null); 
                                        }}
                                        className={`border-2 rounded-lg ${isBuying ? 'border-green-500' : 'border-red-500'}`}
                                        disabled={transactionStatus === 'LOADING'}
                                    >
                                        <option value="BUY">BUY</option>
                                        <option value="SELL">SELL</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3 position-relative">
                                    <Form.Label>Stock Symbol</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={symbol}
                                        onChange={handleSymbolChange}
                                        placeholder="E.g., GOOG"
                                        maxLength={5}
                                        disabled={transactionStatus === 'LOADING' || isFetchingShares}
                                    />
                                    {suggestions.length > 0 && (
                                        <ListGroup className="position-absolute w-100" style={{ zIndex: 1000 }}>
                                            {suggestions.map(s => (
                                                <ListGroup.Item key={s.stock_id} action onClick={() => selectSuggestion(s)}>
                                                    {s.symbol}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Number of Shares</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    max={isSelling ? maxShares : undefined}
                                    value={shares}
                                    onChange={e => { 
                                        setShares(e.target.value); 
                                        if (transactionStatus === 'SUCCESS') setTransactionStatus('IDLE');
                                        setMessage(null); 
                                    }}
                                    disabled={transactionStatus === 'LOADING' || isFetchingShares}
                                />
                                {isSelling && (
                                    <Button
                                        variant="outline-danger"
                                        onClick={handleAllShares}
                                        disabled={shares === maxShares.toString() || transactionStatus === 'LOADING' || isFetchingShares || maxShares === 0}
                                    >
                                        All Shares ({userShares ?? '...'})
                                    </Button>
                                )}
                            </InputGroup>
                        </Form.Group>

                        <Button variant={buttonVariant} type="submit" className="w-full py-2 font-bold rounded-lg" disabled={isDisabled}>
                            {transactionStatus === 'LOADING' ? 'Processing...' : buttonText}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default BuySell;
