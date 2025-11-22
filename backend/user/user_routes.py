from flask import Blueprint, request, jsonify
from .user_repo import edit_user_record, get_user_by_id, get_user_watchlist, get_user_stocks, delete_user, get_user_transactions

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route('/delete_user', methods=['DELETE'])
def delete_user_route():
    data = request.get_json()
    
    if 'user_id' not in data:
        return jsonify({"error": "Missing user_id."}), 400

    user_id = data['user_id']

    try:
        delete_user(user_id)  
        
        return jsonify({
            "status": "success",
            "message": "User deleted successfully."
        }), 200
        
    except Exception as e:
        print(f"Delete User Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500



@user_bp.route('/user_stocks', methods=['GET'])
def user_stocks():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id parameter."}), 400

    try:
        stocks = get_user_stocks(user_id)  
        
        return jsonify({
            "status": "success",
            "stocks": stocks
        }), 200
        
    except Exception as e:
        print(f"User Stocks Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@user_bp.route('/user_watchlist', methods=['GET'])
def get_watchlist():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id parameter."}), 400

    try:
        watchlist = get_user_watchlist(user_id)  
        
        return jsonify({
            "status": "success",
            "watchlist": watchlist
        }), 200
        
    except Exception as e:
        print(f"Get Watchlist Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500


@user_bp.route('/user_profile', methods=['GET'])
def get_user_profile():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id parameter."}), 400

    try:
        user_record = get_user_by_id(user_id)  
        
        if not user_record:
            return jsonify({"error": "User not found."}), 404
        
        return jsonify({
            "status": "success",
            "user": {
                "user_id": user_record[0],
                "username": user_record[1],
                "email": user_record[2],
            }
        }), 200
        
    except Exception as e:
        print(f"Get User Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@user_bp.route('/edit_profile', methods=['PUT'])
def edit_profile():
    data = request.get_json()
    
    if 'user_id' not in data:
        return jsonify({"error": "Missing user_id."}), 400

    user_id = data.pop('user_id')
    
    if not data:
        return jsonify({"error": "No fields to update."}), 400

    try:
        edit_user_record(user_id, data)  
        
        return jsonify({
            "status": "success",
            "message": "User profile updated successfully."
        }), 200
        
    except Exception as e:
        print(f"Profile Edit Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    
@user_bp.route('/transactions', methods=['GET'])
def get_transactions():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id parameter."}), 400

    try:
        transactions = get_user_transactions(user_id)  
        
        return jsonify({
            "status": "success",
            "transactions": transactions
        }), 200
        
    except Exception as e:
        print(f"Get Transactions Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500


