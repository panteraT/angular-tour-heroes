import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  [x: string]: any;

  messages: string[] = [];

  private heroesUrl = 'api/heroes';  // URL to web api
  
  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
  
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
