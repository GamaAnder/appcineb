import { Component,ChangeDetectorRef } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonItem, IonLabel, IonList  } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonList, IonHeader, IonToolbar, 
    IonTitle, IonContent, 
    IonItem, IonLabel, FormsModule, CommonModule],
})
export class Tab1Page {
  private readonly http:HttpClient;
  usuarios:any = [];
  
  constructor(http:HttpClient, private cdr : ChangeDetectorRef) {
    this.http = http;
    this.buscarUsuarios();
  }

  buscarUsuarios(){
    this.http.get("http://localhost:8080/usuario/buscar").subscribe(
      data => {
        this.usuarios = data;
        this.cdr.detectChanges();
      }
    )
  }
}