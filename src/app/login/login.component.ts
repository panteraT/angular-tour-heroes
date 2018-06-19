import { Component, OnInit, ViewEncapsulation, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from '../user.service';
import { User } from '../user';
import { Token } from '../token';
import { TokenService } from '../token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class LoginComponent  {

  user: User;
  users: User[];
  

  constructor( 
    private MatDialogRef: MatDialogRef<LoginComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private tokenService: TokenService,
    public snackBar: MatSnackBar){}

  
  close(){
		this.MatDialogRef.close();
  }
  
  getUser(login: string, pass: string){
   
    this.userService.getUser(login,pass).toPromise()
    .then(user=>{this.user=user;
      console.log(this.user);
      return user;})
    .then(user=>{this.tokenService.getToken(login).subscribe(token => window.localStorage.setItem("token", token.token));
      window.localStorage.setItem("userLogin", this.user.login)
    })
    .then(user=>this.MatDialogRef.close())
  }


}
