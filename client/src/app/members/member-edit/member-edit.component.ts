import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { DatePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent, DatePipe, TimeagoModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  //browser related
  //nu functioneaza
  @HostListener('window.beforeunload', ['$event']) notify($event: any) {
    if(this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member?: Member;
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username).subscribe({
      next: member => this.member = member
    })
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        console.log(this.member);
        this.toastr.success('Profile updated successfully');
      }
    })   
    //reseteaza formularul cu valorile actualizate
    this.editForm?.reset(this.member);
  }

  onMemberChange(event: Member) {
    //in child component avem un output prop care 
    //emite un event atunci cand member-ul primit ca
    //input se modifica, respectiv cand adauga o 
    //noua poza. Event-ul va fi de tip member si va 
    //contine member-ul actualizat
    console.log("onMemberChange() member-edit.ts")
    this.member = event;
  }
}
