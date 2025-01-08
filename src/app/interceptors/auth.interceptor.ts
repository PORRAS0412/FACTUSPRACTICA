import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { inject } from '@angular/core';
import { AuthapisService } from '../services/authapis.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthapisService);  // Inyección del servicio

  // 1. Obtén el authToken y refreshToken del sessionStorage
  const authToken = sessionStorage.getItem('authToken');
  const refreshToken = sessionStorage.getItem('refreshToken'); // Asegúrate de tener el refresh_token en sessionStorage

  // 2. Si el authToken existe, añade el encabezado Authorization
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authReq);
  }

  // 3. Si no existe el authToken pero hay un refreshToken, intenta obtener un nuevo authToken
  if (refreshToken) {
    return authService.refreshtoken(refreshToken).pipe(
      switchMap((newTokenResponse) => {
        // Si la respuesta es exitosa, guarda el nuevo authToken y refreshToken
        sessionStorage.setItem('authToken', newTokenResponse.access_token); // Usa el nombre correcto de la respuesta
        sessionStorage.setItem('refreshToken', newTokenResponse.refresh_token); // Guarda el nuevo refresh_token si es proporcionado

        // Clona la solicitud original con el nuevo token y la pasa al siguiente interceptor
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newTokenResponse.access_token}`,
          },
        });

        return next(clonedReq);
      }),
      catchError((error) => {
        // Maneja el error si la solicitud de refreshToken falla
        console.error('Error al refrescar el token:', error);
        // Aquí puedes redirigir al usuario a la página de login si el refreshToken falla
        return of(error);
      })
    );
  }

  // Si no hay ningún token ni refreshToken, pasa la solicitud sin cambiar
  return next(req);
};
