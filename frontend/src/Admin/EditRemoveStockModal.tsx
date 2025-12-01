import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export interface StockUpdateData {
    companyName: string;
    description: string;
}

interface EditRemoveStockModalProps {
    show: boolean;
    handleClose: () => void;
    onUpdate: (symbol: string, data: StockUpdateData) => Promise<void>; 
    onRemove: (symbol: string) => Promise<void>; 
}

const EditRemoveStockModal: React.FC<EditRemoveStockModalProps> = ({ 
    show, 
    handleClose, 
    onUpdate, 
    onRemove 
}) => {
    // 3. State variables renamed and added
    const [symbol, setSymbol] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // 4. reset state when closing
    const handleModalClose = () => {
        setSymbol('');
        setCompanyName('');
        setDescription('');
        setError('');
        setSuccess('');
        handleClose();
    };
    
    // --- HANDLER FOR SYMBOL INPUT (Max 4, Uppercase) ---
    const handleSymbolChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase();
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        setSymbol(value);
    };
    // ----------------------------------------


    // 5. Refactored Update Submission
    const handleUpdateSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!symbol) {
            setError('Stock symbol is required.');
            return;
        }
        if (!companyName && !description) {
            setError('Please enter a new Company Name or Description to update.');
            return;
        }

        const updateData: StockUpdateData = {
            companyName: companyName,
            description: description,
        };

        setLoading(true);
        try {
            await onUpdate(symbol, updateData);
            setSuccess(`Successfully updated details for ${symbol}`);
            setCompanyName(''); // Clear fields after successful update
            setDescription(''); 
        } catch (err) {
            const msg = (err as Error)?.message || 'Failed to update stock details.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // 6. Refactored Remove Submission
    const handleRemoveSubmit = async () => {
        setError('');
        setSuccess('');

        if (!symbol) {
            setError('Please enter the Stock Symbol you wish to remove.');
            return;
        }

        // IMPORTANT: Must replace window.confirm with a custom modal in a real app
        if (!window.confirm(`Are you sure you want to permanently delete ${symbol}? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            await onRemove(symbol); // Using 'symbol'
            setSuccess(`Successfully removed ${symbol}`);
            setSymbol(''); // Clear everything on remove
            setTimeout(handleModalClose, 1500); // Close after brief success msg
        } catch (err) {
            const msg = (err as Error)?.message || 'Failed to remove stock.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit or Remove Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form>
                    {/* Common Field: Symbol Selection (Ticker renamed) */}
                    <Form.Group className="mb-4" controlId="formSymbolSelect">
                        <Form.Label className="fw-bold">Stock Symbol</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter Symbol (e.g. TSLA)" 
                            value={symbol} 
                            onChange={handleSymbolChange} // Using symbol handler
                            maxLength={4}
                            autoFocus
                        />
                        <Form.Text className="text-muted">
                            Enter the 4-letter symbol of the stock you want to modify.
                        </Form.Text>
                    </Form.Group>

                    <hr />

                    {/* Action 1: Update Company Details */}
                    <h6 className="text-primary mb-3">Update Stock Details</h6>
                    <Form.Group className="mb-3" controlId="formCompanyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="New Company Name (Optional)" 
                            value={companyName} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={3}
                            placeholder="New Description (Optional)" 
                            value={description} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} 
                        />
                    </Form.Group>
                    
                    <div className="d-grid mb-4">
                        <Button 
                            variant="primary" 
                            onClick={handleUpdateSubmit} 
                            disabled={loading || !symbol || (!companyName && !description)}
                        >
                            {loading ? 'Updating...' : 'Update Details'}
                        </Button>
                    </div>

                    <hr />

                    {/* Action 2: Remove Stock */}
                    <h6 className="text-danger mb-3">Danger Zone: Remove Stock</h6>
                    <div className="d-grid">
                        <Button 
                            variant="outline-danger" 
                            onClick={handleRemoveSubmit} 
                            disabled={loading || !symbol}
                        >
                            {loading ? 'Processing...' : `Remove Stock ${symbol ? `(${symbol})` : ''}`}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditRemoveStockModal;
