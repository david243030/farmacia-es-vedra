import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  email = '';
  contrasena = '';
  mensajeError = '';
  usuarioActual: User | null = null;
  busqueda = '';
  mostrarLogin = false;

  productosPorCategoria = {
    Bucal: [
      {
        id: 101,
        nombre: 'Cepillo de dientes infantil',
        descripcion: 'Especialmente diseñado para niños.',
        precio: 3.25,
        imagenUrl: 'assets/productos/cepillo.jpg'
      },
      {
        id: 102,
        nombre: 'Enjuague Bucal FreshMint',
        descripcion: 'Refresca el aliento y elimina bacterias.',
        precio: 3.99,
        imagenUrl: 'assets/productos/enjuague.jpg'
      }
    ],
    Cosmética: [
      {
        id: 103,
        nombre: 'Crema Hidratante Facial',
        descripcion: 'Piel suave y luminosa durante todo el día.',
        precio: 5.50,
        imagenUrl: 'assets/productos/crema-facial.jpg'
      }
    ],
    Dietética: [
      {
        id: 104,
        nombre: 'Complemento Vitamínico Multivit',
        descripcion: 'Vitaminas esenciales para tu bienestar.',
        precio: 8.90,
        imagenUrl: 'assets/productos/vitaminas.jpg'
      }
    ],
    Corporal: [
      {
        id: 105,
        nombre: 'Gel de Ducha Suave',
        descripcion: 'Limpieza diaria para piel sensible.',
        precio: 4.75,
        imagenUrl: 'assets/productos/gel-corporal.jpg'
      },
      {
        id: 106,
        nombre: 'Loción Corporal Hidratante',
        descripcion: 'Hidratación intensa por 24h.',
        precio: 6.99,
        imagenUrl: 'assets/productos/locion.jpg'
      }
    ]
  };

  carrito: any[] = [];
  sub: Subscription;

  constructor(private router: Router, private carritoService: CarritoService) {
    this.sub = this.carritoService.obtenerCarrito().subscribe(c => this.carrito = c);
  }

  login() {
    const auth = getAuth();
    this.mensajeError = '';

    if (!this.email || !this.contrasena) {
      this.mensajeError = 'Por favor, introduce email y contraseña.';
      return;
    }

    signInWithEmailAndPassword(auth, this.email, this.contrasena)
      .then((credenciales) => {
        this.usuarioActual = credenciales.user;
        alert('Sesión iniciada correctamente');
        this.mostrarLogin = false;
      })
      .catch((error) => {
        console.error(error);
        this.mensajeError = 'Email o contraseña incorrectos.';
      });
  }

  registrarConGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        this.usuarioActual = result.user;
        alert(`Bienvenido ${this.usuarioActual.displayName || this.usuarioActual.email}`);
        this.mostrarLogin = false;
      })
      .catch((error) => {
        console.error('Error con Google', error);
        this.mensajeError = 'Error al iniciar sesión con Google.';
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

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
  }

  obtenerTotal(): number {
    return this.carritoService.totalCarrito();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
