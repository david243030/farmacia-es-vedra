import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: User | null = null;
  pedidos: any[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.usuario = user;
        await this.cargarPedidos(user.email!);
      } else {
        this.usuario = null;
      }
    });
  }

  async cargarPedidos(email: string) {
    const ref = collection(this.firestore, 'pedidos');
    const q = query(ref, where('usuarioEmail', '==', email));
    const snapshot = await getDocs(q);

    this.pedidos = snapshot.docs.map(doc => doc.data());
  }

  cerrarSesion() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.usuario = null;
    });
  }
}
