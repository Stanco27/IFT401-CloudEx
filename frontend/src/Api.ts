import axios from 'axios';


// This will be updated once we deploy the backend
const API_BASE_URL = 'https://ift401-cloudex.onrender.com/';

interface LoginCredentials {
    email?: string;
    username?: string;
    password_hash: string; 
}


// STOCK APIs //
export const getStocks = async () => {

    try { 
        const response = await axios.get(`${API_BASE_URL}/stocks/all`);
        return response.data;

    } catch (error) {
        console.error("Error fetching stocks:", error);
        throw error;
    }
}

export const editStock = async (stock_id: string, updateData: { companyName?: string; description?: string; }) => {
    try {
        const url = `${API_BASE_URL}/stocks/edit`;
        const payload = {
            stock_id,
            ...updateData
        };
        const response = await axios.put(url, payload);
        return response.data;
    } catch (error) {
        console.error("Error editing stock:", error);
        throw error;
    }
}

export const getStockId = async (symbol: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/stock_id`;
        const response = await axios.get(url, {
            params: { symbol: symbol }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching stock ID:", error);
        throw error;
    }
}

export const searchStocks = async (query: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/search`;
        const response = await axios.get(url, {
            params: { query: query }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching stocks:", error);
        throw error;
    }
}

export const buy_sellStock = async (transactionData: { user_id: string; stock_id: string; shares: number; price_per_share: number; fee_amount: number, transaction_type: 'BUY' | 'SELL'; }) => {
    try {
        const url = `${API_BASE_URL}/stocks/buy_sell`;
        const response = await axios.post(url, transactionData);
        return response.data;
    } catch (error) {
        console.error("Error processing stock transaction:", error);
        throw error;
    }
}

export const getTotalShares = async (user_id: string, stock_id: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/get_shares`;
        const response = await axios.get(url, {
            params: { user_id: user_id, stock_id: stock_id }
        });
                console.log("get_shares response:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error fetching total shares:", error);
        throw error;
    }
}

export const deleteStock = async (stock_id: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/delete_stock`;
        const response = await axios.delete(url, {
            data: { 
                stock_id: stock_id
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting stock:", error);
        throw error;
    }
}

export const createStock = async (stockData: { company_name: string; symbol: string; initial_price: number; description: string; is_tradable: boolean }) => {
    try {
        const url = `${API_BASE_URL}/stocks/create_stock`;
        const response = await axios.post(url, stockData);
        return response.data;
    } catch (error) {
        console.error("Error adding stock:", error);
        throw error;
    }
}

export const getTopLosers = async () => {
    try { 
        const response = await axios.get(`${API_BASE_URL}/stocks/top_losers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top losers:", error);
        throw error;
    }
}

export const getTopGainers = async () => {
    try { 
        const response = await axios.get(`${API_BASE_URL}/stocks/top_gainers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top gainers:", error);
        throw error;
    }
}

// USER APIs //
export const deleteUser = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/user/delete_user`;
        const response = await axios.delete(url, {
            data: { 
                user_id: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

export const createUser = async (userData: { username: string; email: string; password_hash: string; user_role_id?: number }) => {
    try {
        const url = `${API_BASE_URL}/auth/register`; 
        const response = await axios.post(url, userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }   
}

export const checkLoginStatus = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/auth/check_login_status`;
        const response = await axios.get(url, {
            params: {
                user_id: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error checking status:", error);
        throw error;
    }
}

export const loginUser = async (credentials: LoginCredentials) => {
    try {
        const url = `${API_BASE_URL}/auth/login`;
        const response = await axios.post(url, credentials);
        
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    } 
};

export const getUserTransactions = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/user/transactions`;
        const response = await axios.get(url, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        throw error;
    }
}

export const searchStocksBar = async (query: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/search_bar`;
        const response = await axios.get(url, {
            params: { query: query }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching stocks for search bar:", error);
        throw error;
    }
}

export const addUserTransaction = async (transactionData: { user_id: string; stock_symbol: string; quantity: number; price: number; type: 'buy' | 'sell'; }) => {
    try {
        const url = `${API_BASE_URL}/user/add_transaction`;
        const response = await axios.post(url, transactionData);
        return response.data;
    } catch (error) {
        console.error("Error adding user transaction:", error);
        throw error;
    }
}

export const getUserIdByUsername = async (username: string) => {
    try {
        const url = `${API_BASE_URL}/user/get_user_by_username`;
        const response = await axios.get(url, {
            params: { username: username.toLowerCase() }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user ID by username:", error);
        throw error;
    }
}

export const getUserIdByEmail = async (email: string) => {
    try {
        const url = `${API_BASE_URL}/user/get_user_by_email`;
        const response = await axios.get(url, {
            params: { email: email.toLowerCase() }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user ID by email:", error);
        throw error;
    }
}

export const logoutUser = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/auth/logout`;
        const response = await axios.post(url, { user_id: userId });
        return response.data;
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
}

export const getWishlist = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/get_wishlist`;
        const response = await axios.get(url, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }   
}

export const getFullWishlist = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/user/full_wishlist`;
        const response = await axios.get(url, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching full wishlist:", error);
        throw error;
    }
}

export const addToWishlist = async (userId: string, stockId: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/add_wishlist`;
        const response = await axios.post(url, { user_id: userId, stock_id: stockId });
        return response.data;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
}

export const removeFromWishlist = async (userId: string, stockId: string) => {
    try {
        const url = `${API_BASE_URL}/stocks/remove_wishlist`;
        const response = await axios.post(url, { user_id: userId, stock_id: stockId });
        return response.data;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
    }
}

export const getPortfolio = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/user/get_portfolio`;
        const response = await axios.get(url, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
    }
}

export const getUserBalance = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/user/get_user_balance`;
        const response = await axios.get(url, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user balance:", error);
        throw error;
    }
}

export const getDailyPortfolioChange = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/user/daily_portfolio_change`;
        const response = await axios.get(url, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching daily portfolio change:", error);
        throw error;
    }
}

export const addFunds = async (userId: string, amount: number) => {
    try {
        const url = `${API_BASE_URL}/user/add_funds`;
        const response = await axios.post(url, { user_id: userId, amount: amount });
        return response.data;
    } catch (error) {
        console.error("Error adding funds:", error);
        throw error;
    }
}

export const withdrawFunds = async (userId: string, amount: number) => {
    try {
        const url = `${API_BASE_URL}/user/withdraw_funds`;
        const response = await axios.post(url, { user_id: userId, amount: amount });
        return response.data;
    } catch (error) {
        console.error("Error withdrawing funds:", error);
        throw error;
    }
}

export const getUserRole = async (userId: string) => {
    try {
        const url = `${API_BASE_URL}/auth/get_role`;
        const response = await axios.get(url, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user role:", error);
        throw error;
    }
}

export const updateUserProfile = async (userId: string, updateData: { email?: string; password_hash?: string; }) => {
    try {
        const url = `${API_BASE_URL}/user/edit_profile`;
        const payload = {
            user_id: userId,
            ...updateData
        };
        const response = await axios.put(url, payload);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }   
}
