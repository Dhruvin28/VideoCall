import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Utils from 'src/app/utils/utils';
import { CallUser, PeerService } from '../../services/peer.service';
import { SocketService } from '../../services/socket.service';
import { log } from 'console';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit, AfterViewInit {
  public joinedUsers: CallUser[] = [];
  public localStream: MediaStream = null;
  public roomId: string = '';
  public isHideChat = true;
  public isAdmin: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private peerService: PeerService,) { 
      this.activatedRoute.queryParams.subscribe(param => {
        if (param && param.isAdmin) {
          this.isAdmin = param.isAdmin;
          window.alert('1 '+ this.isAdmin)
          this.roomId = param.roomId;
        }
      })
    }

  ngAfterViewInit(): void {
    this.listenNewUser();
    this.listenLeavedUser();
    this.detectScreenWith();
  }

  ngOnInit(): void {
    window.alert(this.roomId)
    window.alert('2 ' + this.isAdmin)
    window.alert(this.isAdmin.toString() == 'true')
    if (this.isAdmin.toString() == 'true') {
      // if (true) {
      window.alert('Hi')
      Utils.getMediaStream({ video: true, audio: true }).then(stream => {
        this.localStream = stream;
        this.openPeer();
      })
    }
    else {
      window.alert('inside else')
      this.openPeer();
    }
   
  }

  hideOrUnhideChat(): void {
    this.isHideChat = !this.isHideChat;
  }

  private detectScreenWith(): void {
    if (window.screen.width > 719) {
      setTimeout(() => {
        this.isHideChat = false;
      }, 200);
    }
  }

  private listenNewUser(): void {
    this.listenNewUserJoinRoom();
    this.listenNewUserStream();
  }

  private listenLeavedUser(): void {
    this.socketService.leavedId.subscribe(userPeerId => {
      this.joinedUsers = this.joinedUsers.filter(x => x.peerId != userPeerId);
    })
  }

  private listenNewUserJoinRoom(): void {
    this.socketService.joinedId.subscribe(newUserId => {
      if (newUserId) {
        this.makeCall(newUserId);
      }
    })
  }

  private listenNewUserStream(): void {
    this.peerService.joinUser.subscribe(user => {
      console.log('user -> ', user);
      
      if (user) {
        if (this.joinedUsers.findIndex(u => u.peerId === user.peerId) < 0) {
          this.joinedUsers.push(user);
        }
      }
      console.log(this.joinedUsers)
    })
  }

  private openPeer(): void {
    this.peerService.openPeer(this.localStream).then((myPeerId) => {
      this.joinRoom(this.roomId, myPeerId);
    })
  }

  private makeCall(anotherPeerId: string): void {
    this.peerService.call(anotherPeerId, this.localStream);
  }

  private joinRoom(roomId: string, userPeerId: string): void {
    this.socketService.joinRoom(roomId, userPeerId);
  }

}
