import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameClientService {

  private socket: any;
  playerId: string;
  lobbyId: string;
  observer: Observer<string>;

  constructor() {
    this.socket = new WebSocket(environment.api);
    this.socket.onopen = () => {
      console.log('WebSocket connected');
    }
    this.socket.onmessage = event => {
      let data = JSON.parse(event.data);
      this.handleMessage(data);
      this.observer.next(data);
    }
    this.socket.onclose = event => {
      console.log(event);
    }
    this.socket.onerror = event => {
      console.log(event);
    }
  }

  handleMessage(data) {
    switch(data.type) {
      case 'handshake_ack':
        this.playerId = data.playerId;
        this.lobbyId = data.lobbyId;
        break;
      case 'start_ack':
        break;
    }
  }

  getMessages(): Observable<any> {
    return new Observable<any>(observer => {
      this.observer = observer;
    });
  }

  send(msg: any) {
    if (this.socket) {
      this.socket.send(JSON.stringify(msg));
    } else {
      console.log('No websocket connection has been made.');
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }

}
