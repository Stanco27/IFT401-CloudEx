from flask import Blueprint, request, jsonify
from .auth_repo import login_user, create_user, logout_user, get_user_id

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    
    if 'user_id' not in data:
        return jsonify({"error": "Missing user_id."}), 400

    user_id = data['user_id']

    try:
        logout_user(user_id)  
        
        return jsonify({
            "status": "success",
            "message": "User logged out successfully."
        }), 200
        
    except Exception as e:
        print(f"Logout Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if 'password_hash' not in data: 
        return jsonify({"error": "Missing password."}), 400

    username = data.get('username')
    email = data.get('email')
    password = data['password_hash'] 

    if not username and not email:
        return jsonify({"error": "Missing username or email identifier."}), 400
    
    if not username:
        username = ""
    if not email:
        email = ""

    try:
        user = login_user(email, username, password)
        
        if user is None:
            return jsonify({"error": "Invalid login credentials."}), 401
        
        return jsonify({
            "status": "success",
            "user": {
                "user_id": user[0],
                "username": user[1],
                "email": user[2],
            }
        }), 200
        
    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    
@auth_bp.route('/register', methods=['POST']) 
def register_user():
    data = request.get_json()
    
    required_fields = ['username', 'email', 'password_hash']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields."}), 400

    try:
        plaintext_password = data['password_hash'] 

        user_data = {
            'username': data['username'],
            'email': data['email'],
            'password_hash': plaintext_password, 
        }

        user_id = create_user(user_data) 
        
        return jsonify({
            "status": "success",
            "message": "User registered successfully.",
            "user_id": user_id
        }), 201
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
        
    except Exception as e:
        print(f"Registration Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    
    # Will update for higher security (e.g., JWT) later
@auth_bp.route('/user_id', methods=['GET'])
def fetch_user_id():
    username = request.args.get('username')
    email = request.args.get('email')
    
    if not username:
        return jsonify({"error": "Missing username parameter."}), 400
    if not email:
        return jsonify({"error": "Missing email parameter."}), 400

    try:
        user_id = get_user_id(email, username)  
        
        if user_id is None:
            return jsonify({"error": "User not found."}), 404
        
        return jsonify({
            "status": "success",
            "user_id": user_id
        }), 200
        
    except Exception as e:
        print(f"Fetch User ID Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
