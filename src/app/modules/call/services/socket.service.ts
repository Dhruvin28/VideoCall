import { Injectable } from '@angular/core';//
import { BehaviorSubject } from 'rxjs//';
import io, { Socket } from 'socket.io-client';

@Injectable()
export class SocketService {
    public joinedId = new BehaviorSubject(null);
    public leavedId = new BehaviorSubject(null);
    public newMessage = new BehaviorSubject(null);
    public socket: Socket;

    constructor() {
        this.socket = io('https://103.127.146.190:1437/', { secure: true }); //https://live.datnikon.com/
        //this.socket = io('http://192.168.1.8:1437/', { path: '/socket' }); //https://live.datnikon.com/
        this.hanleUserConnect();
        this.handleNewMessage();
    }

    public joinRoom(roomId: string, userId: string): void {
        this.socket.emit('join-room', roomId, userId);
    }

    public chat(content: string): void {
        this.socket.emit('chat', content);
    }

    private hanleUserConnect(): void {
        this.socket.on('user-connected', userId => {
            console.log('user connected!!!');
            
            this.joinedId.next(userId);
        })
        this.socket.on('user-disconnected', userId => {
            this.leavedId.next(userId);
        })
    }

    private handleNewMessage(): void {
        this.socket.on('new-message', (content) => {
            this.newMessage.next(content);
        })
    }
}