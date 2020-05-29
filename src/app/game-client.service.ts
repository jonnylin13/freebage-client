import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameClientService {

  private socket: any;
  playerId: string;
  lobby: any = {
    id: '',
    players: []
  };
  observer: Observer<string>;

  connect() {
    if (this.socket) return;
    this.socket = new WebSocket(environment.api);
    this.socket.onmessage = event => {
      let data = JSON.parse(event.data);
      this.handleMessage(data);
      this.observer.next(data);
    }
    this.socket.onclose = event => {
      console.log(event);
      this.socket = null;
    }
    this.socket.onerror = event => {
      console.log(event);
      this.socket = null;
    }
  }

  handleMessage(data) {
    switch(data.type) {
      case 'handshake_ack':
        this.playerId = data.playerId;
        this.lobby.id = data.lobbyId;
        if (data.code == 1)
          this.lobby.players.push({name: data.name, id: data.playerId});
        break;
      case 'start_ack':
        break;
      case 'update_lobby':
        this.lobby.players = data.players;
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
      this.connect();
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.send(msg);
      }
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

}
