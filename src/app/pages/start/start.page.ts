import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(private router:Router, private storage: NativeStorage) { }

  async ngOnInit() {
    // Check if the session token exists to keep the user logged in
    try {
      const token = await this.storage.getItem('session_token');
      if (token) {
        // If token exists, navigate to home
        this.router.navigate(['/home']);
      }
    } catch (error) {
      // No token found, user needs to log in
    }
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
