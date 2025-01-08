import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { loadingHttpInterceptor } from './interceptors/loading-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideClientHydration(),
     provideAnimationsAsync(),
     provideAnimationsAsync(),
     provideHttpClient(withInterceptors([authInterceptor,loadingHttpInterceptor])),
     importProvidersFrom(
      NgxUiLoaderModule.forRoot({
        // Configuración del loader
      })
    )
    ]

};
