import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  mostrarFormulario = false;
  usuario: User | null = null;

  envio = {
    nombre: '',
    direccion: '',
    ciudad: '',
    cp: ''
  };

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.carritoService.obtenerCarrito().subscribe((productos) => {
      this.carrito = productos;
    });

    onAuthStateChanged(this.auth, (user) => {
      this.usuario = user;
    });
  }

  obtenerTotal(): number {
    return this.carrito.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);
  }

  cambiarCantidad(index: number, nuevaCantidad: number) {
    this.carrito[index].cantidad = nuevaCantidad;
    this.carritoService.actualizarCarrito(this.carrito);
  }

  eliminarProducto(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  verificarContinuar() {
    if (this.usuario) {
      this.mostrarFormulario = true;
    } else {
      alert('🔒 Debes iniciar sesión para continuar.');
      this.router.navigate(['/login']);
    }
  }

  confirmarPedido(form: NgForm) {
    if (form.valid) {
      this.router.navigate(['/pago'], {
        state: {
          carrito: this.carrito,
          total: this.obtenerTotal(),
          envio: this.envio
        }
      });
    }
  }
}
