import { Component,ChangeDetectorRef } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonItem, IonLabel, IonRow, IonCol, IonGrid, IonList, IonImg  } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonList, IonHeader, IonToolbar, 
    IonTitle, IonContent, 
    IonItem, IonLabel, IonRow, IonCol, IonGrid, FormsModule, CommonModule, IonImg],
})
export class Tab2Page {
  private readonly http:HttpClient;
  anuncios:any = [];
  
  constructor(http:HttpClient, private cdr : ChangeDetectorRef) {
    this.http = http;
    this.buscarAnuncios();
  }

    obtenerImagen(base64: string): string {
      if (!base64) {
        return '';
      }

      if (base64.startsWith('data:image/')) {
        return base64;
      }

      return `data:image/jpeg;base64,${base64}`;
    }

  buscarAnuncios(){
    this.http.get("http://localhost:8080/anuncio/buscar").subscribe(
      data => {
        this.anuncios = data;
        this.cdr.detectChanges();
      }
    )
  }
}