import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: any[] = [];
  private carrito$ = new BehaviorSubject<any[]>([]);

  constructor() {}

  obtenerCarrito() {
    return this.carrito$.asObservable();
  }

  agregarProducto(producto: any) {
    const index = this.carrito.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      this.carrito[index].cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.carrito$.next(this.carrito);
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.carrito$.next(this.carrito);
  }

  vaciarCarrito() {
    this.carrito = [];
    this.carrito$.next(this.carrito);
  }

  totalCarrito(): number {
    return this.carrito.reduce((total, prod) => total + (prod.precio * prod.cantidad), 0);
  }

  // ✅ NUEVO: permite actualizar todo el carrito
  actualizarCarrito(nuevoCarrito: any[]) {
    this.carrito = nuevoCarrito;
    this.carrito$.next(this.carrito);
  }
}
