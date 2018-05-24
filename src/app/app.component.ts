import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SignupComponent} from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { User } from './user';
import { TokenService } from './token.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Tour of Heroes';
  users: User[];
  user: User;
  
  constructor ( 
    public dialog: MatDialog,
    private userService: UserService,
    private tokenService: TokenService) {}

  getUsers(): void {
      this.userService.getUsers()
      .subscribe(users => {this.users = users});
  }
  ngOnInit(){
    this.getUsers();
  }

  public openModalSignup(){
    const dialog =this.dialog.open(SignupComponent, {data: {subject: 'Sign up form'}});
  }

  getUser(login: string, pass: string){
   
      this.userService.getUser(login,pass).subscribe(user=>this.user=user);
  
      console.log(this.user);
      if (this.user){
        this.tokenService.getToken(login).subscribe(token => window.localStorage.setItem("token", token.token));
        window.localStorage.setItem("userLogin", this.user.login)

      
      }
  }

  closeInformation(){
    window.localStorage.clear();
  }

}
