import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { appSettings } from '../../settings/appsettings';

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css'],
})
export class DisponibilidadComponent implements OnInit {
  horarioForm!: FormGroup;
  mensaje: string = '';
  citas: any[] = [];
  private baseUrl = appSettings.apiUrl;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.horarioForm = this.fb.group({
      dias: this.fb.array([]),
    });
    this.cargarDias();
    this.obtenerCitas();
    this.obtenerDisponibilidad();
  }

  get dias(): FormArray {
    return this.horarioForm.get('dias') as FormArray;
  }

  private cargarDias() {
    const diasSemana = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    diasSemana.forEach((dia) => {
      this.dias.push(
        this.fb.group({
          nombre: [dia],
          horarios: this.fb.array([
            this.fb.group({
              hora: ['09:15 AM', Validators.required],
              seleccionado: [false],
              bloqueado: [false],
            }),
            this.fb.group({
              hora: ['09:30 AM', Validators.required],
              seleccionado: [false],
              bloqueado: [false],
            }),
            this.fb.group({
              hora: ['09:45 AM', Validators.required],
              seleccionado: [false],
              bloqueado: [false],
            }),
            this.fb.group({
              hora: ['10:00 AM', Validators.required],
              seleccionado: [false],
              bloqueado: [false],
            }),
            this.fb.group({
              hora: ['10:30 AM', Validators.required],
              seleccionado: [false],
              bloqueado: [false],
            }),
          ]),
        })
      );
    });
  }

  obtenerCitas() {
    this.http.get<any>(`${this.baseUrl}/appointments`).subscribe({
      next: (data) => (this.citas = data),
      error: (err) => {
        console.error('Error al obtener citas:', err);
      },
    });
  }

  obtenerDisponibilidad() {
    this.http.get<any>(`${this.baseUrl}/availability`).subscribe({
      next: (data) => {
        if (data && data.dias) {
          data.dias.forEach((d: any, index: number) => {
            if (this.dias.at(index)) {
              this.dias.at(index).patchValue(d);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener disponibilidad:', err);
      },
    });
  }

  guardar() {
    if (!localStorage.getItem('token')) {
      this.mensaje = 'Debe iniciar sesión para modificar su disponibilidad.';
      return;
    }

    this.http
      .post(`${this.baseUrl}/availability`, this.horarioForm.value)
      .subscribe({
        next: () => {
          this.mensaje = 'Disponibilidad actualizada con éxito';
        },
        error: (err) => {
          console.error('Error al guardar disponibilidad:', err);
          this.mensaje = 'Error al actualizar la disponibilidad';
        },
      });
  }

  bloquearHorario(diaIndex: number, horarioIndex: number) {
    if (diaIndex < this.dias.length) {
      const dia = this.dias.at(diaIndex);
      if (dia) {
        const horarios = dia.get('horarios') as FormArray;
        if (horarioIndex < horarios.length) {
          const horario = horarios.at(horarioIndex);
          if (horario) {
            horario.patchValue({ bloqueado: true });
          }
        }
      }
    }
  }

  seleccionarHorario(diaIndex: number, horarioIndex: number) {
    if (diaIndex < this.dias.length) {
      const dia = this.dias.at(diaIndex);
      if (dia) {
        const horarios = dia.get('horarios') as FormArray;
        if (horarioIndex < horarios.length) {
          const horario = horarios.at(horarioIndex);
          if (horario) {
            horario.patchValue({ seleccionado: true });
          }
        }
      }
    }
  }
}
