from flask import Blueprint, request, jsonify
from .stock_repo import get_stocks, get_stock_by_id, create_stock, delete_stock, update_stock, buy_sell_stock, get_stock_price

stock_bp = Blueprint('stocks', __name__, url_prefix='/stocks')

@stock_bp.route('/all', methods=['GET'])
def all_stocks():
    try:
        stocks = get_stocks()  
        
        return jsonify({
            "status": "success",
            "stocks": stocks
        }), 200
        
    except Exception as e:
        print(f"All Stocks Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    
@stock_bp.route('/stock_by_id', methods=['GET'])
def stock_by_id():
    stock_id = request.args.get('stock_id')
    if not stock_id:
        return jsonify({"error": "Missing stock_id parameter."}), 400

    try:
        stock_record = get_stock_by_id(stock_id)  
        
        if stock_record is None:
            return jsonify({"error": "Stock not found."}), 404
        
        return jsonify({
            "status": "success",
            "stock": stock_record
        }), 200
        
    except Exception as e:
        print(f"Stock By ID Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    
@stock_bp.route('/create_stock', methods=['POST'])
def create_stock_route():
    data = request.get_json()
    
    required_fields = ['company_name', 'symbol', 'initial_price', 'description']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}."}), 400

    stock_data = {
        'company_name': data['company_name'],
        'symbol': data['symbol'],
        'initial_price': data['initial_price'],
        'description': data['description']
    }

    try:
        stock_id = create_stock(stock_data)  
        
        return jsonify({
            "status": "success",
            "stock_id": stock_id
        }), 201
        
    except Exception as e:
        print(f"Create Stock Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@stock_bp.route('/delete_stock', methods=['DELETE'])
def delete_stock_route():
    stock_id = request.args.get('stock_id')
    if not stock_id:
        return jsonify({"error": "Missing stock_id parameter."}), 400

    try:
        delete_stock(stock_id)  
        
        return jsonify({
            "status": "success",
            "message": "Stock deleted successfully."
        }), 200
        
    except Exception as e:
        print(f"Delete Stock Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    
@stock_bp.route('/edit', methods=['PUT'])
def edit_stock():
    data = request.get_json()
    
    if 'stock_id' not in data:
        return jsonify({"error": "Missing stock_id in request."}), 400
    
    stock_id = data['stock_id']
    
    try:
        was_updated = update_stock(stock_id, data) 
        if not was_updated:
            return jsonify({"error": f"Stock with ID {stock_id} not found."}), 404
        
        return jsonify({
            "status": "success",
            "message": f"Stock {stock_id} updated successfully."
        }), 200
        
    except Exception as e:
        print(f"Edit Stock Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    
@stock_bp.route('/buy_sell', methods=['POST'])
def buy_sell_route():
    data = request.get_json()
    
    required_fields = ['user_id', 'stock_id', 'shares', 'action', 'fee_amount'] 
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}."}), 400

    user_id = data['user_id']
    stock_id = data['stock_id']
    shares = data['shares']
    action = data['action'] 
    fee_amount = data['fee_amount']
    
    try:
        price_per_share = get_stock_price(stock_id) 
        
        success = buy_sell_stock(
            user_id, 
            stock_id, 
            shares, 
            price_per_share,
            fee_amount, 
            action
        ) 
        
        if success:
            return jsonify({
                "status": "success",
                "message": "Transaction completed successfully."
            }), 201
        else:
            return jsonify({"error": "Transaction failed internally."}), 500

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
        
    except Exception as e:
        print(f"Buy/Sell Stock Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500