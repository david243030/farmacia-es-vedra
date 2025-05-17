from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Optional
import json

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if not firebase_admin._apps:
    cred = credentials.Certificate("farmacia-web-1b504-firebase-adminsdk-fbsvc-fc7e0843cd.json")
    firebase_admin.initialize_app(cred)


db = firestore.client()
productos_ref = db.collection("productos")

@app.get("/")
def inicio():
    return {"message": "Farmacia backend funcionando correctamente."}

@app.get("/productos")
def obtener_productos(categoria: Optional[str] = None, busqueda: Optional[str] = None):
    docs = productos_ref.stream()
    productos = []

    for doc in docs:
        data = doc.to_dict()

       
        if categoria and categoria.lower() not in data.get("categoria", "").lower():
            continue
        if busqueda and busqueda.lower() not in data.get("nombre", "").lower():
            continue

        data["id"] = doc.id
        productos.append(data)

    return productos

@app.post("/productos-carga-masiva")
def cargar_productos_masiva():
    try:
        
        docs = productos_ref.stream()
        for doc in docs:
            doc.reference.delete()

        
        with open("productos.json", "r", encoding="utf-8") as f:
            productos = json.load(f)

       
        for producto in productos:
            productos_ref.document().set(producto)

        return {"mensaje": f"✅ {len(productos)} productos cargados correctamente (anteriores eliminados)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
