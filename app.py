import os,sqlite3,json
from datetime import datetime
from flask import Flask,request,jsonify,render_template
from groq import Groq
app=Flask(__name__)
DB=os.getenv("DATABASE_PATH","bizpilot.db")
def conn():
 c=sqlite3.connect(DB); c.row_factory=sqlite3.Row; return c
def init():
 with conn() as c:
  c.execute("CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,customer TEXT,product TEXT,amount REAL,status TEXT,created_at TEXT)")
  if c.execute("SELECT COUNT(*) FROM orders").fetchone()[0]==0:
   c.executemany("INSERT INTO orders(customer,product,amount,status,created_at) VALUES(?,?,?,?,?)",[(a,b,v,s,datetime.utcnow().isoformat()) for a,b,v,s in [("Amira","Streetwear hoodie",89,"Delivered"),("Youssef","Classic T-shirt",45,"Pending"),("Sarra","Oversized shirt",65,"Processing"),("Malek","Cargo pants",110,"Delivered")]])
@app.get("/")
def home(): return render_template("index.html")
@app.get("/health")
def health(): return jsonify(status="ok",app="BizPilot AI")
@app.get("/api/summary")
def summary():
 with conn() as c: rows=[dict(x) for x in c.execute("SELECT * FROM orders ORDER BY id DESC")]
 return jsonify(orders=rows,revenue=round(sum(x["amount"] for x in rows if x["status"]=="Delivered"),2),order_count=len(rows),pending=sum(x["status"] in ("Pending","Processing") for x in rows))
@app.post("/api/orders")
def add():
 d=request.get_json(force=True)
 try: amount=float(d.get("amount",0))
 except: amount=0
 customer=str(d.get("customer","")).strip(); product=str(d.get("product","")).strip()
 if not customer or not product or amount<=0:return jsonify(error="Enter customer, product and a positive amount."),400
 with conn() as c: cur=c.execute("INSERT INTO orders(customer,product,amount,status,created_at) VALUES(?,?,?,?,?)",(customer,product,amount,"Pending",datetime.utcnow().isoformat()))
 return jsonify(id=cur.lastrowid),201
@app.patch("/api/orders/<int:i>")
def update(i):
 status=request.get_json(force=True).get("status")
 if status not in ("Pending","Processing","Delivered","Cancelled"):return jsonify(error="Invalid status"),400
 with conn() as c:
  cur=c.execute("UPDATE orders SET status=? WHERE id=?",(status,i))
  if not cur.rowcount:return jsonify(error="Order not found"),404
 return jsonify(ok=True)
@app.post("/api/chat")
def chat():
 msg=str(request.get_json(force=True).get("message","")).strip()
 if not msg:return jsonify(error="Enter a message"),400
 with conn() as c: rows=[dict(x) for x in c.execute("SELECT customer,product,amount,status FROM orders")]
 data={"orders":rows,"total_orders":len(rows),"delivered_revenue":sum(x["amount"] for x in rows if x["status"]=="Delivered")}
 key=os.getenv("GROQ_API_KEY")
 if not key:return jsonify(reply="AI is not connected yet. Add GROQ_API_KEY to the deployment environment. Your dashboard and order manager work without it.")
 try:
  client=Groq(api_key=key); out=client.chat.completions.create(model=os.getenv("GROQ_MODEL","llama-3.3-70b-versatile"),messages=[{"role":"system","content":"You are BizPilot AI, a concise small-business operations assistant. Analyze only the supplied data; do not invent figures or claim to perform actions. Currency is unspecified. Business data: "+json.dumps(data)},{"role":"user","content":msg}],temperature=.3,max_tokens=700)
  return jsonify(reply=out.choices[0].message.content)
 except Exception:
  app.logger.exception("Groq error");return jsonify(error="AI service unavailable. Check GROQ_API_KEY and GROQ_MODEL."),502
init()
if __name__=="__main__":app.run(host="0.0.0.0",port=int(os.getenv("PORT",5000)))
