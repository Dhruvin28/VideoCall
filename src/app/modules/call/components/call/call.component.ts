import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { json } from 'express';
import { BehaviorSubject } from 'rxjs';
import Utils from 'src/app/utils/utils';
import { CallUser, PeerService } from '../../services/peer.service';
import { SocketService } from '../../services/socket.service';

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
        private peerService: PeerService, ) {
        this.activatedRoute.queryParams.subscribe(param => {
            if (param && param.isAdmin) {
                this.isAdmin = param.isAdmin;
                //window.alert('123 ' + this.isAdmin + this.roomId);
                //window.alert('123456 ' + this.roomId);
                this.roomId = param.roomId;
                //window.alert('123456 ' + this.roomId);
            }
        })
    }

    ngAfterViewInit(): void {
        //window.alert("2");
        this.listenNewUser();
        this.listenLeavedUser();
        this.detectScreenWith();
    }

    ngOnInit(): void {
        //window.alert("1");
        //window.alert('2 ' + this.isAdmin)
        //window.alert(this.isAdmin.toString() == 'true')
        if (this.isAdmin.toString() == 'true') {
            // if (true) {
            //window.alert('Hi')
            Utils.getMediaStream({ video: true, audio: true }).then(stream => {
                window.alert(JSON.stringify(stream));
                this.localStream = stream;
                this.openPeer();
            })
        }
        else {
            //window.alert('inside else')
            this.openPeer();
        }

    }

    hideOrUnhideChat(): void {
        //window.alert("3");
        this.isHideChat = !this.isHideChat;
    }

    private detectScreenWith(): void {
        //window.alert("4 " + window.screen.width);
        if (window.screen.width > 719) {
            setTimeout(() => {
                this.isHideChat = false;
            }, 200);
        }
    }

    private listenNewUser(): void {
        //window.alert("5");
        this.listenNewUserJoinRoom();
        this.listenNewUserStream();
    }

    private listenLeavedUser(): void {
        //window.alert("6");
        //window.alert(JSON.stringify(this.socketService.leavedId));
        this.socketService.leavedId.subscribe(userPeerId => {

            //window.alert("6 " + userPeerId);
            this.joinedUsers = this.joinedUsers.filter(x => x.peerId != userPeerId);
        })
    }

    private listenNewUserJoinRoom(): void {
        //window.alert("7");
        window.alert(JSON.stringify(this.socketService.joinedId));
        window.alert(JSON.stringify(this.socketService.joinedId.value));
        if (this.socketService.joinedId == null || this.socketService.joinedId.value == null) {
            //const newJoinedId = this.generateNewJoinedId(); // Replace this with your own logic to generate a new value if needed.
            //this.socketService.joinedId = newJoinedId;
            this.setNewJoinedId();
        }

        this.socketService.joinedId.subscribe(newUserId => {
            //window.alert(newUserId);
            if (newUserId) {
                this.makeCall(newUserId);
            }
        })
    }

    // Call this function when you want to set a new joinedId in your class
    setNewJoinedId() {
        if (this.socketService.joinedId === null) {
            // Step 2: Call the generateNewJoinedId function and subscribe to its value changes
            const generatedIdSubject = this.generateNewJoinedId();
            //generatedIdSubject.subscribe((newId) => {
            window.alert(JSON.stringify(generatedIdSubject));
            this.socketService.joinedId = generatedIdSubject;
            window.alert("qqq" + JSON.stringify(this.socketService.joinedId));
            //console.log("New joined ID set:", this.socketService.joinedId);
            //});
        } else {
            console.log("Joined ID already set:", this.socketService.joinedId);
        }
    }

    // Step 1: Create the generateNewJoinedId function that returns a BehaviorSubject
    generateNewJoinedId() {
        const length = 10; // Adjust the length of the generated ID as per your requirements
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        // Create and return a BehaviorSubject with the generated ID as the initial value
        return new BehaviorSubject(result);
    }

    private listenNewUserStream(): void {
        //window.alert("8");
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
        //window.alert("9");
        //window.alert(JSON.stringify(this.localStream));
        this.peerService.openPeer(this.localStream).then((myPeerId) => {
            this.joinRoom(this.roomId, myPeerId);
        })
    }

    private makeCall(anotherPeerId: string): void {
        //window.alert("10");
        //window.alert(anotherPeerId);
        this.peerService.call(anotherPeerId, this.localStream);
    }

    private joinRoom(roomId: string, userPeerId: string): void {
        //window.alert("11");
        this.socketService.joinRoom(roomId, userPeerId);
    }

}
