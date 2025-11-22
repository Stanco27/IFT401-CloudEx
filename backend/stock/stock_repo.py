import psycopg2
from decimal import Decimal
from .. import db

def get_stocks():
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = "SELECT * FROM stocks;"
        cursor.execute(query)
        
        stocks = cursor.fetchall()
        return stocks  
    
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
def get_stock_by_id(stock_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = "SELECT * FROM stocks WHERE stock_id = %s;"
        cursor.execute(query, (stock_id,))
        
        stock_record = cursor.fetchone()
        return stock_record  
    
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
def create_stock(stock_data):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        insert_query = """
            INSERT INTO stocks (company_name, symbol, initial_price, description)
            VALUES (%s, %s, %s, %s) RETURNING stock_id;
        """
        cursor.execute(insert_query, (
            stock_data['company_name'],
            stock_data['symbol'],
            stock_data['initial_price'],
            stock_data['description']
        ))
        stock_id = cursor.fetchone()[0]
        conn.commit()
        
        return stock_id  
    
    except psycopg2.Error as e:
        print(f"Database error in create_stock: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
def delete_stock(stock_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        delete_query = "DELETE FROM stocks WHERE stock_id = %s;"
        cursor.execute(delete_query, (stock_id,))
        conn.commit()
        
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        print(f"Database error: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
def update_stock(stock_id, stock_data):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        update_query = """
            UPDATE stocks
            SET company_name = %s,
                symbol = %s,
                description = %s
            WHERE stock_id = %s;
        """
        
        cursor.execute(update_query, (
            stock_data['company_name'],
            stock_data['symbol'],
            stock_data['description'],
            stock_id
        ))
        
        rows_affected = cursor.rowcount
        conn.commit()
        
        if rows_affected == 0:
            return False
        return True
        
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        print(f"Database error in update_stock: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def buy_sell_stock(user_id, stock_id, shares, price_per_share, fee_amount, transaction_type):
    conn = None
    cursor = None
    
    try:
        shares = Decimal(str(shares))
        fee_amount = Decimal(str(fee_amount))
        price_per_share = Decimal(str(price_per_share)) 
    except Exception:
        raise ValueError("Invalid number format for shares or fee_amount.")

    amount = shares * price_per_share
    
    if transaction_type.upper() == 'BUY':
        net_cash_change = -(amount + fee_amount)
    elif transaction_type.upper() == 'SELL':
        net_cash_change = amount - fee_amount
    else:
        raise ValueError("Invalid transaction_type. Must be 'BUY' or 'SELL'.")

    if not price_per_share or price_per_share <= 0:
        raise ValueError("Invalid stock price provided for transaction.")

    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        cursor.execute("SELECT balance FROM cloudex_users WHERE user_id = %s FOR UPDATE;", (user_id,))
        current_balance_record = cursor.fetchone()
        
        if current_balance_record is None:
            raise ValueError(f"User ID {user_id} not found.")

        current_balance = current_balance_record[0]
        new_balance = current_balance + net_cash_change
        
        if transaction_type.upper() == 'BUY' and new_balance < 0:
            raise ValueError("Insufficient funds to complete this purchase.")
        
        update_balance_query = "UPDATE cloudex_users SET balance = %s WHERE user_id = %s;"
        cursor.execute(update_balance_query, (new_balance, user_id))
        
        insert_query = """
            INSERT INTO transaction_history 
                (user_id, stock_id, shares, price_per_share, transaction_type, 
                 amount, fee_amount, executed_at)
            VALUES 
                (%s, %s, %s, %s, %s, %s, %s, NOW()) RETURNING transaction_id;
        """
        cursor.execute(insert_query, (
            user_id, stock_id, shares, price_per_share, transaction_type, 
            amount, fee_amount
        ))
        transaction_id = cursor.fetchone()[0]
        
        conn.commit()
        return transaction_id

    except ValueError:
        if conn:
            conn.rollback() 
        raise
        
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        print(f"Database error in buy_sell_stock: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
def get_stock_price(stock_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = "SELECT price FROM stocks WHERE stock_id = %s;"
        cursor.execute(query, (stock_id,))
        
        result = cursor.fetchone()
        
        if result is None:
            raise ValueError(f"Stock ID {stock_id} does not exist.")
            
        return result[0] 
    
    except psycopg2.Error as e:
        print(f"Database error in get_stock_price: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()