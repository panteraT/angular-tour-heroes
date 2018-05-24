import { Component, OnInit, ViewEncapsulation, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from '../user.service';
import { User } from '../user';
import { Token } from '../token';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class LoginComponent implements OnInit {

  user: User;
  users: User[];
  login: string;
  passwprd: string;

  constructor( 
    private MatDialogRef: MatDialogRef<LoginComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    public snackBar: MatSnackBar){}

  ngOnInit() {
    if (this.login && this.passwprd){
      this.getUser(this.login,this.passwprd);
    }
  }
  
  close(){
		this.MatDialogRef.close();
  }
  
  getUser(login: string, pass: string){
   
  /*  this.userService.getUser(login,pass).subscribe(user=>this.user=user);

    console.log(this.user);
    if (this.user){
      this.userService.getToken(login).subscribe(token => window.localStorage.setItem("token", token.token));
      window.localStorage.setItem("userLogin", this.user.login)
      this.MatDialogRef.close();
    
    }
    */
  }


}
