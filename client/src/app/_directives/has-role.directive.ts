import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]', //*appHasRole
  standalone: true
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole: string[] = [];
  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  ngOnInit(): void {
    if(this.accountService.roles()?.some(r => this.appHasRole.includes(r))) {
      //adaugam elementul admin in view
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      //stergem elementul din view
      this.viewContainerRef.clear();
    }
  }
}
