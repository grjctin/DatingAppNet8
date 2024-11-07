import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{

  private memberService = inject(MembersService);
  //cand ajungem in componenta asta venim prin ruta .../api/users/username
  //pentru a accesa username avem nevoie sa injectam activatedroute
  private route = inject(ActivatedRoute);
  member?: Member;
  //galerie pentru photos
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    //numele parametrului trebuie sa corespunda exact
    //cu cel din ruta, specificat in app.routes
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        member.photos.map(p => {
          this.images.push(new ImageItem({src: p.url, thumb: p.url}))
          // this.images.push(new ImageItem({src: p.url, thumb: p.url}))
        })
      }
    })

  }
}
