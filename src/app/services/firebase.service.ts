import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) {}

  // ✅ Método para añadir un documento (por ejemplo, un producto o usuario)
  addData(collectionName: string, data: any): Promise<any> {
    const ref = collection(this.firestore, collectionName);
    return addDoc(ref, data);
  }

  // ✅ Método para obtener datos en tiempo real de una colección
  getData(collectionName: string): Observable<any[]> {
    const ref = collection(this.firestore, collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
}
