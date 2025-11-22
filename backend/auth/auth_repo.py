import psycopg2
from .. import db

def logout_user(user_id):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        update_query = """
            UPDATE cloudex_users
            SET is_logged_in = FALSE
            WHERE user_id = %s;
        """
        cursor.execute(update_query, (user_id,))
        conn.commit()
        
    except psycopg2.Error as e:
        print(f"Database error in logout_user: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def login_user(email, username, password):
    conn = None
    cursor = None
    user_record = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        auth_query = """
            SELECT user_id, username, email 
            FROM cloudex_users 
            WHERE (email = %s OR username = %s) 
              AND password_hash = %s;
        """
        cursor.execute(auth_query, (email, username, password))
        user_record = cursor.fetchone()

        if user_record:
            user_id = user_record[0]

            update_query = """
                UPDATE cloudex_users
                SET is_logged_in = TRUE, last_login_at = NOW()
                WHERE user_id = %s;
            """
            cursor.execute(update_query, (user_id,))
            conn.commit()
            
            return user_record 
        
        return None

    except psycopg2.Error as e:
        print(f"Database error in login_user: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def create_user(user_data):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        insert_query = """
            INSERT INTO cloudex_users 
                (username, email, password_hash)
            VALUES 
                (%s, %s, %s)
            RETURNING user_id;
        """
        
        data_tuple = (
            user_data['username'],
            user_data['email'],
            user_data['password_hash']
        )
        
        cursor.execute(insert_query, data_tuple)
        
        user_id = cursor.fetchone()[0]
        conn.commit()
        
        return user_id
    
    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        raise ValueError("Username or Email already exists.") from e 

    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        print(f"Database error in create_user: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
# Will update in the future for higher security (e.g., hashing)
def get_user_id(email, username):
    conn = None
    cursor = None
    try:
        conn = db.get_db_conn() 
        cursor = conn.cursor()
        
        query = "SELECT user_id FROM cloudex_users WHERE email = %s AND username = %s;"
        cursor.execute(query, (email, username))
        
        result = cursor.fetchone()
        return result[0] if result else None 
    
    except psycopg2.Error as e:
        print(f"Database error in get_user_id: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()