import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  email: string = '';
  password: string = '';
  mensajeError: string = '';

  constructor(private auth: Auth, private router: Router) {}

  registrar() {
    this.mensajeError = '';

    if (!this.email || !this.password) {
      this.mensajeError = '⚠️ El email y la contraseña son obligatorios.';
      return;
    }

    if (this.password.length < 6) {
      this.mensajeError = '⚠️ La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        alert('✅ Registro exitoso');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Error en registro:', error.code, error.message);

        if (error.code === 'auth/email-already-in-use') {
          this.mensajeError = '⚠️ Este correo ya está registrado. Inicia sesión o usa otro.';
        } else {
          this.mensajeError = '❌ Error al registrarse: ' + error.message;
        }
      });
  }
}
