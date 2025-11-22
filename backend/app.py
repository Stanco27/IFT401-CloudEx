from flask import Flask, jsonify, render_template
from . import db  
from .user.user_routes import user_bp
from .auth.auth_route import auth_bp
from .stock.stock_route import stock_bp

app = Flask(__name__)
app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(stock_bp)

@app.route("/")
def home():
    return render_template("base.html")

@app.route("/health")
def health():
    try:
        conn = db.get_db_conn() 
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify(status="ok", db=version)
    except Exception as e:
        return jsonify(status="error", error=str(e))

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/api/transaction_history")
def api_transaction_history():
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT * FROM public.transaction_history ORDER BY 1 DESC LIMIT 100;")
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        cur.close(); conn.close()
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500