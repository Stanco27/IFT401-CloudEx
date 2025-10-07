from flask import Flask, jsonify, render_template
from db import get_db_conn

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("base.html")

@app.route("/health")
def health():
    try:
        conn = get_db_conn()
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
