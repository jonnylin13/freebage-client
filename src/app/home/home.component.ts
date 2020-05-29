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

  constructor(private gameClient: GameClientService) { 
  }

  ngOnInit() {
    this.sub = this.gameClient.getMessages().subscribe(data => {
      console.log(data);
      if (data.type == 'leave_ack' && data.code == 1) {
        this.goHome();
      }
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  joinLobby() {
    this.currentPage = 'join-lobby';
  }

  submitJoinLobby() {
    this.gameClient.send({type: 'handshake', name: this.playerName, lobbyId: this.lobbyId});
    this.currentPage = 'waiting';
  }

  goHome() {
    this.currentPage = 'home';
  }

  createLobby() {
    this.gameClient.send({type: 'handshake', name: this.playerName});
    this.currentPage = 'waiting';
  }

  leaveGame() {
    this.gameClient.send({type: 'leave', playerId: this.gameClient.playerId, lobbyId: this.gameClient.lobbyId});
  }

}
