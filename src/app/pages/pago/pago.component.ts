import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent {
  carrito: any[] = [];
  total: number = 0;
  envio: any = {};
  metodoPago: string = '';
  pagoRealizado = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      carrito: any[];
      total: number;
      envio: any;
    };
    if (state) {
      this.carrito = state.carrito;
      this.total = state.total;
      this.envio = state.envio;
    }
  }

  finalizarPago() {
    if (this.metodoPago) {
      this.pagoRealizado = true;
      // Aquí podrías guardar en Firestore si quieres
    }
  }
}
