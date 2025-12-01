import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import type { FormEvent, ChangeEvent } from 'react';

interface StockData {
    symbol: string;
    company_name: string;
    price: number;
    description: string;
}

interface AddStockModalProps {
    show: boolean;
    handleClose: () => void;
    onSubmit: (data: StockData) => Promise<any>;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ show, handleClose, onSubmit }) => {
    const [symbol, setSymbol] = useState<string>('');
    const [company_name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>(''); 
    const [description, setDescription] = useState<string>('');
    
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSymbolChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase();
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        setSymbol(value);
    };

    const handleResetAndClose = () => {
        setSymbol('');
        setName('');
        setPrice('');
        setDescription('');
        setError('');
        setSuccessMessage('');
        handleClose();
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (!symbol) {
            setError('Ticker Symbol is required.');
            return;
        }
        if (!company_name) {
            setError('Company Name is required.');
            return;
        }
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setError('Please enter a valid price greater than zero.');
            return;
        }
        if (!description) {
            setError('Description is required.');
            return;
        }
        
        setLoading(true);

        const stockData: StockData = {
            symbol,
            company_name,
            price: parseFloat(price),
            description,
        };

        try {
            await onSubmit(stockData);
            
            setSuccessMessage(`Stock ${symbol} added successfully!`);
            
            setTimeout(() => {
                handleResetAndClose();
            }, 1500); 

        } catch (err) {
            const errorMessage = (err as Error)?.message || 'Failed to add stock. Please check your inputs and try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleResetAndClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {successMessage && <Alert variant="success">{successMessage}</Alert>} 
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                {!successMessage && (
                    <Form onSubmit={handleSubmit}>
                        
                        <Form.Group className="mb-3" controlId="formTicker">
                            <Form.Label>Ticker Symbol</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. AAPL" 
                                value={symbol} 
                                onChange={handleSymbolChange}
                                maxLength={4}
                                required 
                            />
                            <Form.Text className="text-muted">
                                Must be 4 letters maximum, all uppercase.
                            </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formCompanyName">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. Apple Inc." 
                                value={company_name} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formPrice">
                            <Form.Label>Initial Price</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.01" 
                                placeholder="0.00" 
                                value={price} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4" controlId="formDescription">
                            <Form.Label>Stock Description</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                placeholder="A brief description of the company and its business." 
                                value={description} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} 
                                required 
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100" 
                            disabled={loading || !!successMessage}
                        >
                            {loading ? 'Adding...' : 'Add Stock'}
                        </Button>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AddStockModal;
