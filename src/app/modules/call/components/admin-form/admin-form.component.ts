import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss']
})
export class AdminFormComponent implements OnInit {

  code='';
  roomId = '';
  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void {
  }
  onClick() {
    if (this.code === 'admin') {
      this.router.navigate(['call/videoCall'], {queryParams: {isAdmin: true, roomId: this.roomId}})
    }
    else {
      this.router.navigate(['call/videoCall'], {queryParams: {isAdmin: false, roomId: this.roomId}})
    }
  }

}
