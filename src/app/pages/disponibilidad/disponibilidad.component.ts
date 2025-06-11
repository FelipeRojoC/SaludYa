import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { appSettings } from '../../settings/appsettings';

@Component({
  selector: 'app-disponibilidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css']
})
export class DisponibilidadComponent implements OnInit {
  horarioForm!: FormGroup;
  mensaje: string = '';
  citas: any[] = [];
  private baseUrl = appSettings.apiUrl;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.horarioForm = this.fb.group({
      dias: this.fb.array([])
    });
    this.cargarDias();
    this.obtenerCitas();
    this.obtenerDisponibilidad();
  }

  get dias(): FormArray {
    return this.horarioForm.get('dias') as FormArray;
  }

  private cargarDias() {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    diasSemana.forEach(dia => {
      this.dias.push(this.fb.group({
        nombre: [dia],
        inicio: ['', Validators.required],
        fin: ['', Validators.required],
        bloquear: [false]
      }));
    });
  }

  obtenerCitas() {
    this.http.get<any>(`${this.baseUrl}/appointments`).subscribe({
      next: data => this.citas = data,
      error: () => {}
    });
  }

  obtenerDisponibilidad() {
    this.http.get<any>(`${this.baseUrl}/availability`).subscribe({
      next: data => {
        if (data && data.dias) {
          data.dias.forEach((d: any, index: number) => {
            if (this.dias.at(index)) {
              this.dias.at(index).patchValue(d);
            }
          });
        }
      },
      error: () => {}
    });
  }

  guardar() {
    if (!localStorage.getItem('token')) {
      this.mensaje = 'Debe iniciar sesión para modificar su disponibilidad.';
      return;
    }
    if (this.horarioConCitas()) {
      this.mensaje = 'No puede modificar horarios con citas programadas. Primero cancele o reagende las citas afectadas.';
      return;
    }

    this.http.post(`${this.baseUrl}/availability`, this.horarioForm.value).subscribe({
      next: () => {
        this.mensaje = 'Disponibilidad actualizada con éxito';
      },
      error: () => {
        this.mensaje = 'Error al actualizar la disponibilidad';
      }
    });
  }

  private horarioConCitas(): boolean {
    for (const cita of this.citas) {
      const diaIndex = cita.dayIndex; // Se espera que el backend provea el índice del día
      const control = this.dias.at(diaIndex);
      if (!control) continue;
      const inicio = control.get('inicio')?.value;
      const fin = control.get('fin')?.value;
      if (cita.hora >= inicio && cita.hora <= fin && control.get('bloquear')?.value) {
        return true;
      }
    }
    return false;
  }
}
