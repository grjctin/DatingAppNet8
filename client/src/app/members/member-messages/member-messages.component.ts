import { Component, inject, input, OnInit, output, ViewChild, viewChild } from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  messageService = inject(MessageService);
  username = input.required<string>();
  //messages = input.required<Message[]>();
  messageContent = '';
  //output prop pe care emitem mesajul pentru ca in 
  //componenta parinte sa actualizam signal-ul messages
  //updateMessages = output<Message>();

  sendMessage() {
    this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
      this.messageForm?.reset();
    })
    //pre signalR
    // this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
    //   next: message => {
    //     this.messageForm?.reset();
    //   }
    // })
  }
}
