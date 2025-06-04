import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-medical-portal',
  templateUrl: './medicalPortal.component.html',
  styleUrls: ['./medicalPortal.component.css'],
})
export class MedicalPortalComponent implements OnInit {
  doctorName: string = 'Ivo Toloza';
  specialty: string = 'Kinesiología';
  appointments: any[] = [];
  nextAppointment: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.http
      .get('http://localhost/api/appointments')
      .subscribe((data: any) => {
        this.appointments = data.appointments;
        this.nextAppointment = data.nextAppointment;
      });
  }

  logout(): void {
    console.log('Sesión cerrada');
    localStorage.clear();
  }
}
