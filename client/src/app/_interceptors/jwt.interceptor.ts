import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  //req este un immutable object
  //trebuie sa clonam obiectul si sa adaugam authorization header

  if(accountService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + accountService.currentUser()?.token
      }
    })
  }
  
  return next(req);
};
