import psycopg2
from .. import db

def get_user_transactions(user_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = """
            SELECT transaction_id, stock_id, transaction_type, shares, price_per_share, executed_at, price_per_share, fee_amount
            FROM transaction_history
            WHERE user_id = %s
            ORDER BY executed_at DESC;
        """
        cursor.execute(query, (user_id,))
        
        transactions = cursor.fetchall()
        return [
            {
                "transaction_id": row[0],
                "stock_id": row[1],
                "transaction_type": row[2],
                "shares": row[3],
                "price_per_share": row[4],
                "transaction_date": row[5]
            }
            for row in transactions
        ]  
    
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def delete_user(user_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        delete_query = "DELETE FROM cloudex_users WHERE user_id = %s;"
        cursor.execute(delete_query, (user_id,))
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



def get_user_stocks(user_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = """
                SELECT
                s.symbol, s.company_name, p.total_shares, p.average_cost FROM
                portfolio p JOIN
                stocks s ON p.stock_id = s.stock_id WHERE
                p.user_id = %s;
                """
        cursor.execute(query, (user_id,))
        
        stocks = [row[0] for row in cursor.fetchall()]
        return stocks  
    
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_user_watchlist(user_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = """
            SELECT stock_id 
            FROM watchlist 
            WHERE user_id = %s;
        """
        cursor.execute(query, (user_id,))
        
        watchlist = [row[0] for row in cursor.fetchall()]
        return watchlist  
    
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def get_user_by_id(user_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = "SELECT user_id, username, email FROM cloudex_users WHERE user_id = %s;"
        cursor.execute(query, (user_id,))
        
        user_record = cursor.fetchone()
        return user_record  
    
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def edit_user_record(user_id, updated_data):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        update_fields = []
        data_values = []
        
        for key, value in updated_data.items():
            update_fields.append(f"{key} = %s")
            data_values.append(value)
        
        data_values.append(user_id)  
        
        update_query = f"""
            UPDATE cloudex_users
            SET {', '.join(update_fields)}
            WHERE user_id = %s;
        """
        
        cursor.execute(update_query, tuple(data_values))
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