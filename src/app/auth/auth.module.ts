import { NgModule } from '@angular/core';

import { LoginComponent } from '../auth/login/login.component';
import { SingupComponent } from '../auth/singup/singup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    SingupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
