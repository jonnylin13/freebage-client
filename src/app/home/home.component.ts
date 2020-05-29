import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameClientService } from '../game-client.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sub: Subscription;
  playerName: string;
  currentPage: string = 'home';
  lobbyId: string;

  constructor(public gameClient: GameClientService) { 
  }

  ngOnInit() {
    this.sub = this.gameClient.getMessages().subscribe(data => {
      console.log(data);
      switch(data.type) {
        case 'leave_ack':
          if (data.code == 1) {
            this.goHome();
            this.gameClient.close();
          }
          break;
        case 'handshake_ack':
          if (data.code == 1 || data.code == 2)
            this.currentPage = 'waiting';
          break;
      }
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submitJoinLobby() {
    this.gameClient.send({type: 'handshake', name: this.playerName, lobbyId: this.lobbyId});
  }

  goHome() {
    this.currentPage = 'home';
  }

  goJoinLobby() {
    this.currentPage = 'join-lobby';
  }

  submitCreateLobby() {
    this.gameClient.send({type: 'handshake', name: this.playerName});
  }

  startGame() {
    this.gameClient.send({type: 'start', playerId: this.gameClient.playerId, lobbyId: this.gameClient.lobby.id});
  }

  leaveGame() {
    this.gameClient.send({type: 'leave', playerId: this.gameClient.playerId, lobbyId: this.gameClient.lobby.id});
  }

}
