import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  //Putem face ceva inainte de request sau dupa
  //Pentru a face dupa folosim pipe
  return next(req).pipe(
    catchError(error => {
      if(error) {
        switch (error.status) {
          case 400:
            //Daca este validation error e posibil sa aiba mai multe errors
            if(error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if(error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key])
                }
              }
              throw modalStateErrors.flat();
            } else {
              toastr.error(error.error, error.status);
            }
            break;
          
          case 401:
            toastr.error('Unauthorized', error.status);
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            //putem trimite state la o componenta cu navigationextras
            const navigationExtras: NavigationExtras = {state: {error: error.error}};
            router.navigateByUrl('/server-error', navigationExtras);
            break;

          default:
            toastr.error('Something unexpected went wrong');
            break;
        }
      }
      throw error;
    })
  )
};
