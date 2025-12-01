import { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaPlus, FaEdit, FaUserPlus, FaUserTimes } from 'react-icons/fa';
import AddStockModal from './AddStockModal';
import EditRemoveStockModal, { type StockUpdateData } from './EditRemoveStockModal';
import CreateUserModal, { type UserData } from './CreateUserModal';
import RemoveUserModal from './RemoveUserModal';
import { createStock, createUser, deleteStock, deleteUser, editStock, getStockId, getUserIdByEmail, getUserIdByUsername } from '../Api';
import axios from 'axios';
import MarketSettingsModal from "./MarketSettingsModal";

// --- UTILITY FUNCTIONS DEFINED LOCALLY ---
// Checks for a simple email pattern
const handleIsEmail = (str: string): boolean => {
    return str.includes('@') && str.includes('.'); 
};

// Checks for a basic UUID v4 format
const isUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};
// ------------------------------------------


const AdminPage = () => {
    // State to control modal visibility
    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [showEditRemoveStockModal, setShowEditRemoveStockModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
    const [showMarketSettings, setShowMarketSettings] = useState(false);

    // Handlers
    const handleAddStockShow = () => setShowAddStockModal(true);
    const handleAddStockClose = () => setShowAddStockModal(false);
    const handleEditRemoveShow = () => setShowEditRemoveStockModal(true);
    const handleEditRemoveClose = () => setShowEditRemoveStockModal(false);
    const handleCreateUserShow = () => setShowCreateUserModal(true);
    const handleCreateUserClose = () => setShowCreateUserModal(false);
    const handleRemoveUserShow = () => setShowRemoveUserModal(true);
    const handleRemoveUserClose = () => setShowRemoveUserModal(false);
    const handleMarketSettingsShow = () => setShowMarketSettings(true);
    const handleMarketSettingsClose = () => setShowMarketSettings(false);


    // --- STOCK CRUD HANDLERS ---
    const handleCreateStock = async (stockData: any) => {
        try {
            await createStock(stockData);
        } catch (error) {
            console.error("Failed to create stock:", error);
            
            if (axios.isAxiosError(error) && error.response) {
                const responseData = error.response.data;
                const statusCode = error.response.status;
                
                if (statusCode === 409 && responseData && typeof responseData === 'object' && 'error' in responseData) {
                    const backendError = (responseData as { error: string }).error;
                    throw new Error(backendError);
                }
            }
            const genericMessage = (error as Error)?.message || "A server or network error occurred.";
            throw new Error(genericMessage);
        };
    }

    const handleRemoveStock = async (symbol: string) => {
        try {
            const stockIdResponse = await getStockId(symbol);
            const stockId = stockIdResponse?.stock_id; 

            if (!stockId) {
                throw new Error(`Stock with symbol ${symbol} could not be resolved to an ID.`);
            }
            
            await deleteStock(stockId);

        } catch (error) {
            console.error("Failed to execute stock removal process:", error);
            
            let errorMessage: string;

            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                const backendMessage = (error.response.data as { error?: string })?.error;
                
                if (status === 404) {
                    errorMessage = `Deletion failed: Stock symbol (${symbol}) was not found.`;
                } 
                else if (status === 409) {
                    errorMessage = backendMessage || `Deletion failed: The stock is linked to existing data (409 Conflict).`;
                }
                else if (backendMessage) {
                    errorMessage = `Deletion failed: ${backendMessage}`;
                }
                else {
                    errorMessage = `Deletion failed: Request failed with status code ${status}.`;
                }
            } 
            else {
                errorMessage = (error instanceof Error ? error.message : 'An unknown error occurred.');
            }

            throw new Error(errorMessage);
        }
    };

    const handleEditStock = async (symbol: string, data: StockUpdateData) => {
        try { 
            const stockIdResponse = await getStockId(symbol);
            const stockId = stockIdResponse?.stock_id;
            
            if (!stockId) {
                throw new Error(`Stock with symbol ${symbol} not found.`);
            }
            
            const updateData = {
                description: data.description,
                company_name: data.companyName,
            };

            await editStock(stockId, updateData);
            
        } catch (error) {
            console.error("Failed to edit stock:", error);
            const errorMessage = (error instanceof Error ? error.message : 'An unknown error occurred.');
            throw new Error(`Stock edit failed: ${errorMessage}`);
        }
    }
    
    // --- USER DELETION HANDLER (FIXED FOR UUID) ---
    const handleDeleteUser = async (identifier: string) => {
        let userUUIDToDelete: string | null = null;
        const cleanIdentifier = identifier.trim();

        try {
            // 1. Logic to determine if a lookup is needed (removes unnecessary numeric checks)
            if (handleIsEmail(cleanIdentifier)) {
                // Case 1: Input is Email, resolve UUID
                const idResponse = await getUserIdByEmail(cleanIdentifier);
                userUUIDToDelete = idResponse?.user_id || null; 

            } else if (!isUUID(cleanIdentifier)) {
                // Case 2: Input is NOT an Email and NOT a UUID, treat as Username, resolve UUID
                const idResponse = await getUserIdByUsername(cleanIdentifier);
                userUUIDToDelete = idResponse?.user_id || null;
            } else {
                // Case 3: Input IS a UUID, use it directly (this is the only path where no lookup is needed)
                userUUIDToDelete = cleanIdentifier;
            }

            // 2. Final Check and Deletion
            if (!userUUIDToDelete || !isUUID(userUUIDToDelete)) {
                throw new Error(`User identified by '${cleanIdentifier}' was not found, or the resolved ID format is incorrect.`);
            }
            
            // 3. Deletion (Called with the verified UUID string)
            await deleteUser(userUUIDToDelete); 
            
        } catch (error) {
            console.error("Failed to delete user:", error);
            
            const errorMessage = (error instanceof Error ? error.message : 'An unknown server error occurred.');
            
            throw new Error(errorMessage);
        }
    };

    const handleCreateUserSubmit = async (data: UserData) => {
            const apiData = {
                username: data.username,
                email: data.email,
                password_hash: data.password_hash,
                user_role_id: data.roleId
            };

            try {
                console.log('Parent making API call with data:', apiData);
                
                await createUser(apiData); 
                console.log(`Successfully created user: ${data.username}`);

            } catch (error) {
                const errorMsg = (error as Error)?.message || "Network or server error during user creation.";
                throw new Error(errorMsg); // Re-throw the error
            }
        };

    return (
        <Container className="py-5">
            {/* Page Header */}
            <Row className="mb-4 text-center">
                <Col>
                    <h1 className="display-4">Stocks Admin Console</h1>
                    <p className="lead text-muted">Direct interface for system and user management.</p>
                </Col>
            </Row>

            {/* Action Selection Tiles */}
            <Row className="g-4 justify-content-center">
                <Col md={12}>
                    <h2 className="mb-4 text-primary">Select an Action</h2>
                </Col>

                {/* 1. Add Stock (Clickable) */}
                <Col md={4} sm={6}>
                    <Card 
                        className="shadow-sm h-100 text-center border-success border-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleAddStockShow}
                    >
                        <Card.Body>
                            <FaPlus size={40} className="text-success mb-3" />
                            <Card.Title className="h5">Add New Stock</Card.Title>
                            <Card.Text className="text-muted">Introduce a new asset.</Card.Text>
                            <Button variant="success" className="w-100 mt-2">Go to Form</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* 2. Edit/Remove Stock */}
                <Col md={4} sm={6}>
                    <Card className="shadow-sm h-100 text-center border-info border-3">
                        <Card.Body>
                            <FaEdit size={40} className="text-info mb-3" />
                            <Card.Title className="h5">Edit/Remove Stock</Card.Title>
                            <Card.Text className="text-muted">Modify or delist assets.</Card.Text>
                            <Button onClick={handleEditRemoveShow} variant="info" className="w-100 mt-2 text-white">Go to Form</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* 3. Create User */}
                <Col md={4} sm={6}>
                    <Card className="shadow-sm h-100 text-center border-primary border-3">
                        <Card.Body>
                            <FaUserPlus size={40} className="text-primary mb-3" />
                            <Card.Title className="h5">Create New User</Card.Title>
                            <Card.Text className="text-muted">Manually register an account.</Card.Text>
                            <Button onClick={handleCreateUserShow} variant="primary" className="w-100 mt-2">Go to Form</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* 4. Remove User */}
                <Col md={4} sm={6}>
                    <Card className="shadow-sm h-100 text-center border-danger border-3">
                        <Card.Body>
                            <FaUserTimes size={40} className="text-danger mb-3" />
                            <Card.Title className="h5">Remove Existing User</Card.Title>
                            <Card.Text className="text-muted">Permanently delete an account.</Card.Text>
                            <Button onClick={handleRemoveUserShow} variant="danger" className="w-100 mt-2">Go to Form</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

                <Col md={4} sm={6}>
                    <Card 
                         className="shadow-sm h-100 text-center border-warning border-3"
                           style={{ cursor: 'pointer' }}
                         onClick={handleMarketSettingsShow}>
                    <Card.Body>
                        <FaEdit size={40} className="text-warning mb-3" />
                         <Card.Title className="h5">Market Settings</Card.Title>
                          <Card.Text className="text-muted">
                               Change market hours and holidays.
                          </Card.Text>
                          <Button variant="warning" className="w-100 mt-2">Open Settings</Button>
                     </Card.Body>
                    </Card>
                    </Col>

            {/* Modal Component */}
            <AddStockModal 
                show={showAddStockModal} 
                handleClose={handleAddStockClose} 
                onSubmit={handleCreateStock} 
            />

            <EditRemoveStockModal
                show={showEditRemoveStockModal}
                handleClose={handleEditRemoveClose} onUpdate={handleEditStock} onRemove={handleRemoveStock} 
            />

            <CreateUserModal
                show={showCreateUserModal}
                handleClose={handleCreateUserClose} onSubmit={handleCreateUserSubmit} />

            <RemoveUserModal
                show={showRemoveUserModal}
                handleClose={handleRemoveUserClose} onSubmit={handleDeleteUser} 
            />

            <MarketSettingsModal
                show={showMarketSettings}
                handleClose={handleMarketSettingsClose}
            />

        </Container>
    );
}

export default AdminPage;
