import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuario: User | null = null;
  busqueda = '';
  mostrarCarrito = false;
  carrito: any[] = [];

  constructor(
    private auth: Auth,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.usuario = user;
    });

    this.carritoService.obtenerCarrito().subscribe(data => {
      this.carrito = data;
    });
  }

  cerrarSesion() {
    signOut(this.auth).then(() => {
      this.usuario = null;
      this.router.navigate(['/login']);
    });
  }

  irAlInicio() {
    this.router.navigate(['/']);
  }

  buscar() {
    if (this.busqueda.trim()) {
      this.router.navigate(['/productos'], {
        queryParams: { busqueda: this.busqueda }
      });
    }
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  eliminarDelCarrito(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
  }

  get totalCarrito(): number {
    return this.carrito.reduce((acc, p) => acc + (p.precio * (p.cantidad || 1)), 0);
  }

  finalizarCompra() {
    alert('🛒 Función de finalizar compra en construcción...');
  }
}
