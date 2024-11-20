import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy{
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  //datorita "{static: true}" memberTabs va fi disponibil
  //in timp ce se initializeaza componenta/in OnInit
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  presenceService = inject(PresenceService);
  //cand ajungem in componenta asta venim prin ruta .../api/users/username
  //pentru a accesa username avem nevoie sa injectam activatedroute
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  //messages: Message[] =[];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
      this.member && this.member.photos.map(p => {
        this.images.push(new ImageItem({src: p.url, thumb: p.url}))
        // this.images.push(new ImageItem({src: p.url, thumb: p.url}))
      })
      }
    })

    this.route.paramMap.subscribe({
      next: _ => this.onRouteParamsChange()      
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  //pre signalR
  // onUpdateMessages(event: Message) {
  //   this.messages.push(event);
  // }

  selectTab(heading:string) {
    if(this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x=>x.heading === heading);
      if(messageTab) messageTab.active=true;
    }
  }

  onRouteParamsChange() {
    const user = this.accountService.currentUser();
    if(!user) return;
    if(this.messageService.hubConnection?.state === HubConnectionState.Connected && this.activeTab?.heading === 'Messages') {
      console.log("Stopping previous hubConnection")
      this.messageService.hubConnection.stop().then(() => {
        console.log("Starting new hubConnection with " + this.member.username)
        this.messageService.createHubConnection(user, this.member.username);
      })
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    //la fiecare schimbare de tab, populeaza 
    //queryparams cu heading-ul tabului activ
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    })
    if (this.activeTab.heading === 'Messages' && this.member) {
      const user = this.accountService.currentUser();
      if(!user) return;
      this.messageService.createHubConnection(user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
    //Pre signalR
    // this.activeTab = data;
    // if (this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) {
    //   this.messageService.getMessageThread(this.member.username).subscribe({
    //     next: messages => this.messages = messages
    //   })
    // }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }


}
