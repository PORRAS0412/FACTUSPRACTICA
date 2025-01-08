import { CommonModule } from '@angular/common';
import { Component,OnInit  } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthapisService } from '../../services/authapis.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Inyección del servicio en el constructor


  user: string = 'halltec';
  password: string = 'halltec123**';
  hide = true;
  title = 'HALLTECT';


  constructor( private authapisService :AuthapisService, private router: Router) {

  }

  ngOnInit(): void {
   // this.getToken()
  }

  iniciarsesion() {
    if (this.user !== 'halltec') {
      alert('El usuario no se encuentra registrado');
    }else if (this.password !== 'halltec123**'){
      alert('La contraseña no es válida, inténtalo de nuevo');
    } else {
      this.getToken();
      this.router.navigate(['dashboard']);  // Asegúrate de que esta ruta esté configurada en el RouterModule
    }
  }



  getToken() {
    this.authapisService.obtenertoken().subscribe(
      (response) => {
        console.log('Token recibido:', response.access_token);
        sessionStorage.setItem('authToken', response.access_token);
        sessionStorage.setItem('refresh_token', response.refresh_token);
      },
      (error) => {
        console.error('Error al obtener token:', error);
      }
    );
  }


  refreshToken() {
    const refreshToken = sessionStorage.getItem('refresh_token');

    if (!refreshToken) {
      console.error('No se encontró el refresh token. Redirigiendo al inicio de sesión...');
      // Aquí podrías redirigir al usuario al inicio de sesión si el token no existe.
      return;
    }

    this.authapisService.refreshtoken(refreshToken).subscribe(
      (response) => {
        if (response && response.access_token) {
          console.log('Nuevo token recibido:', response.access_token);
          sessionStorage.setItem('authToken', response.access_token);
        } else {
          console.error('Respuesta inesperada al obtener el token:', response);
        }
      },
      (error) => {
        console.error('Error al renovar el token:', error);
        // Redirigir al inicio de sesión o tomar alguna acción adicional en caso de error crítico.
      }
    );
  }

}
