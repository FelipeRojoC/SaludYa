import { Component } from '@angular/core';

@Component({
  selector: 'app-medical-portal',
  templateUrl: './medicalPortal.component.html',
  styleUrls: ['./medicalPortal.component.css']
})
export class MedicalPortalComponent {
  doctorName: string = 'Ivo Toloza';
  specialty: string = 'Kinesiología';

  logout(): void {
    // Lógica para cerrar sesión
    console.log('Sesión cerrada');
  }
}
