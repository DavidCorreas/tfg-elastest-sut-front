import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSingup(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}
