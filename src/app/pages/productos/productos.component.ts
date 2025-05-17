import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(Auth);
  carritoService = inject(CarritoService) as CarritoService;

  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaSeleccionada = '';
  busqueda = '';
  usuario: User | null = null;
  productoAgregado = false;

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.auth, (user) => {
      this.usuario = user;
    });

    this.route.queryParams.subscribe(params => {
      this.categoriaSeleccionada = params['categoria'] || '';
      this.busqueda = params['busqueda'] || '';
      this.cargarProductos();
    });
  }

  async cargarProductos() {
    let url = 'http://localhost:8000/productos';
    const filtros: string[] = [];

    if (this.categoriaSeleccionada) filtros.push(`categoria=${this.categoriaSeleccionada}`);
    if (this.busqueda) filtros.push(`busqueda=${this.busqueda}`);
    if (filtros.length) url += '?' + filtros.join('&');

    try {
      const productos = await this.http.get<any[]>(url).toPromise();
      this.productosFiltrados = productos || [];
    } catch (error) {
      console.error('Error al cargar productos del backend:', error);
    }
  }

  agregarAlCarrito(producto: any) {
    if (this.usuario) {
      this.carritoService.agregarProducto(producto);
      this.productoAgregado = true;
      setTimeout(() => this.productoAgregado = false, 3000);
    } else {
      if (confirm('🔒 Debes iniciar sesión para añadir productos.\n¿Quieres iniciar sesión ahora?')) {
        this.router.navigate(['/login']);
      }
    }
  }
}
