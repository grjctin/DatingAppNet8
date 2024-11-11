import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  //datorita "{static: true}" memberTabs va fi disponibil
  //in timp ce se initializeaza componenta/in OnInit
  private memberService = inject(MembersService);
  private messageService = inject(MessageService);
  //cand ajungem in componenta asta venim prin ruta .../api/users/username
  //pentru a accesa username avem nevoie sa injectam activatedroute
  private route = inject(ActivatedRoute);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] =[];

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
    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  onUpdateMessages(event: Message) {
    this.messages.push(event);
  }

  selectTab(heading:string) {
    if(this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x=>x.heading === heading);
      if(messageTab) messageTab.active=true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  // loadMember() {
  //   //numele parametrului trebuie sa corespunda exact
  //   //cu cel din ruta, specificat in app.routes
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if(!username) return;
  //   this.memberService.getMember(username).subscribe({
  //     next: member => {
  //       this.member = member;
  //       member.photos.map(p => {
  //         this.images.push(new ImageItem({src: p.url, thumb: p.url}))
  //         // this.images.push(new ImageItem({src: p.url, thumb: p.url}))
  //       })
  //     }
  //   })
  // }
}
