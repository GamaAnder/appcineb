import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonItem, IonLabel,
  IonSelect, IonSelectOption, IonInput, IonChip, IonBadge
} from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonItem, IonLabel,
    IonSelect, IonSelectOption, IonInput, IonChip, IonBadge
  ]
})
export class Tab4Page {

  private readonly http: HttpClient;

  funciones: any[] = [];
  historial: any[] = [];
  asientosOcupados: string[] = [];

  cliente = '';
  funcionSeleccionada: any = null;
  asientosSeleccionados: string[] = [];
  vista: 'reserva' | 'historial' = 'reserva';

  filas: string[] = ['A', 'B', 'C', 'D', 'E'];
  numerosAsientos: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(http: HttpClient, private cdr: ChangeDetectorRef) {
    this.http = http;
    this.buscarFunciones();
    this.buscarHistorial();
  }

  buscarFunciones() {
    this.http.get<any[]>("http://localhost:8080/funcion/buscar").subscribe(
      data => {
        this.funciones = data;
        if (this.funciones.length > 0) {
          this.funcionSeleccionada = this.funciones[0].idFuncion;
          this.cambiarFuncion();
        }
        this.cdr.detectChanges();
      }
    );
  }

  buscarHistorial() {
    this.http.get<any[]>("http://localhost:8080/reserva/buscar").subscribe(
      data => {
        this.historial = data;
        this.cdr.detectChanges();
      }
    );
  }

  buscarAsientosOcupados(idFuncion: number) {
    this.http.get<string[]>(`http://localhost:8080/asiento/ocupados/${idFuncion}`).subscribe(
      data => {
        this.asientosOcupados = data || [];
        this.cdr.detectChanges();
      },
      error => {
        this.asientosOcupados = [];
        this.cdr.detectChanges();
      }
    );
  }

  get funcionActual(): any {
    return this.funciones.find((f: any) => f.idFuncion === Number(this.funcionSeleccionada)) || {};
  }

  get cantidadEntradas(): number {
    return this.asientosSeleccionados.length;
  }

  get total(): number {
    const precio = Number(this.funcionActual.precioEntrada) || 0;
    return this.cantidadEntradas * precio;
  }

  cambiarFuncion() {
    this.asientosSeleccionados = [];
    if (this.funcionSeleccionada) {
      this.buscarAsientosOcupados(Number(this.funcionSeleccionada));
    }
  }

  estaOcupado(asiento: string): boolean {
    return this.asientosOcupados.includes(asiento);
  }

  estaSeleccionado(asiento: string): boolean {
    return this.asientosSeleccionados.includes(asiento);
  }

  seleccionarAsiento(asiento: string) {
    if (this.estaOcupado(asiento)) return;

    if (this.estaSeleccionado(asiento)) {
      this.asientosSeleccionados = this.asientosSeleccionados.filter(a => a !== asiento);
      return;
    }

    if (this.asientosSeleccionados.length >= 8) {
      alert('Solo puedes seleccionar un máximo de 8 asientos.');
      return;
    }

    this.asientosSeleccionados.push(asiento);
  }

  confirmarReserva() {
    if (!this.cliente.trim()) {
      alert('Ingresa el nombre del cliente.');
      return;
    }

    if (this.asientosSeleccionados.length === 0) {
      alert('Selecciona al menos un asiento.');
      return;
    }

    const body = {
      idFuncion: this.funcionActual.idFuncion,
      asientos: this.asientosSeleccionados,
      cantidadEntradas: this.cantidadEntradas,
      totalAPagar: this.total
    };

    this.http.post("http://localhost:8080/reserva/guardar", body).subscribe(
      (res: any) => {
        alert('¡Reserva confirmada correctamente!');
        this.cliente = '';
        this.asientosSeleccionados = [];
        this.vista = 'historial';
        this.buscarHistorial();
        this.cambiarFuncion();
        this.cdr.detectChanges();
      },
      error => {
        console.error(error);
        alert('Error al crear la reserva');
      }
    );
  }

  cancelarReserva(reserva: any) {
    if (!window.confirm('¿Deseas cancelar esta reserva?')) return;

    this.http.delete(`http://localhost:8080/reserva/eliminar/${reserva.idReserva}`).subscribe(
      () => {
        alert('Reserva cancelada');
        this.buscarHistorial();
        this.cambiarFuncion();
        this.cdr.detectChanges();
      },
      error => {
        console.error(error);
        alert('Error al cancelar la reserva');
      }
    );
  }
}