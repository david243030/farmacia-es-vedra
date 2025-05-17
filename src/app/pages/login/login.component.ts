import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  esRegistro: boolean = false;
  registroExitoso: boolean = false;

  
  dni: string = '';
  nombre: string = '';
  apellidos: string = '';
  fechaNacimiento: string = '';
  telefono: string = '';

  firestore = getFirestore();

  constructor(private auth: Auth, private router: Router) {}

  toggleModo() {
    this.esRegistro = !this.esRegistro;
    this.email = '';
    this.password = '';
    this.dni = '';
    this.nombre = '';
    this.apellidos = '';
    this.fechaNacimiento = '';
    this.telefono = '';
  }

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => this.router.navigate(['/']))
      .catch(error => alert('Error al iniciar sesión: ' + error.message));
  }

  registrar() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (cred) => {
        await setDoc(doc(this.firestore, 'usuarios', cred.user.uid), {
          email: this.email,
          dni: this.dni,
          nombre: this.nombre,
          apellidos: this.apellidos,
          fechaNacimiento: this.fechaNacimiento,
          telefono: this.telefono,
          uid: cred.user.uid,
          creado: new Date().toISOString()
        });
        this.registroExitoso = true;
        this.toggleModo();
      })
      .catch(error => alert('Error al registrarse: ' + error.message));
  }

  loginConGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(() => this.router.navigate(['/']))
      .catch(error => alert('Error con Google: ' + error.message));
  }
}
