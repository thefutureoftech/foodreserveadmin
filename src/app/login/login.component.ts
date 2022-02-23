import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formSettings: any;

  cardSettings: any;

  form: FormGroup;

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router) {

    this.form = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.formSettings = {
      lang: 'en',
      rtl: false,
      labelStyle: 'floating'
    };

    // this.cardSettings = {
    //   lang: 'en',
    //   rtl: false
    // };

  }

  ngOnInit(): void {
this.authService.logout();
  }


  login() {

    console.log(this.form.controls['email'].value);

    this.authService.login(this.form.controls['email'].value, this.form.controls['password'].value).then(user => {

      if (user) {

        this.router.navigateByUrl('/');

      }

    }).catch(error=> {

      console.log('Login Failed');

    });

  }

}
