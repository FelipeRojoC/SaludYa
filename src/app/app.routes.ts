import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './pages/resetPassword/resetPassword.component';
import { MedicalPortalComponent } from './pages/medicalPortal/medicalPortal.component'; // Importar el componente
import { DisponibilidadComponent } from './pages/disponibilidad/disponibilidad.component';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    HttpClientModule,
    // Otros módulos
  ],
})
export class AppModule {}

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'medicalPortal', component: MedicalPortalComponent }, // Agregar la ruta para MedicalPortal
  { path: 'disponibilidad', component: DisponibilidadComponent },
  { path: '**', redirectTo: '/login' },
];
