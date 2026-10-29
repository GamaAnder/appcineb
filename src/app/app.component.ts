import { Component,ChangeDetectorRef } from '@angular/core';
import { IonApp, IonRouterOutlet, IonCard, 
  IonCardContent, IonCardHeader, 
  IonCardSubtitle, IonCardTitle,
  IonInput, IonItem, IonList, IonButton, IonIcon } from '@ionic/angular';
  import { accessibilityOutline,personAddOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [FormsModule,CommonModule, IonCardSubtitle, IonCardContent, 
    IonCard, IonApp, IonRouterOutlet,
    IonCardHeader,IonCardTitle, IonInput, IonItem, IonList, IonButton, IonIcon],
})
export class AppComponent {
  usuario:any = null;
  usuarioLogin:any = {};
  usuarioNuevo:any = {};
  crearNuevo:boolean = false;
  private readonly http:HttpClient;
  constructor(http:HttpClient,private cdr : ChangeDetectorRef) {
    addIcons({ accessibilityOutline,personAddOutline });
    this.http = http;

  }

  login(){
    if(this.usuarioLogin && this.usuarioLogin.correo && this.usuarioLogin.contrasena){
      this.http.post("http://localhost:8080/usuario/login",
        this.usuarioLogin).subscribe(
          retorno => this.validar(retorno)
        )
    }
    else{
      alert("Complete la información");
    }
  }

  validar(usuario:any){
    if(usuario?.idUsuario){
      this.usuario = usuario;
      localStorage.setItem("usuario",JSON.stringify(usuario));
    }
    else{
      alert("Usuario o password invalido");
    }
  }

  crearNuevoBtn(){
    this.crearNuevo = true;
    this.usuarioNuevo = {};
  }

  crear(){
    if(this.usuarioNuevo){
      let temp = {...this.usuarioNuevo};
      temp.fechaCreacion = new Date();
      this.http.post("http://localhost:8080/usuario/guardar",temp).subscribe(
        data => this.mostrar(data)
      )
    }
  }

  mostrar(data:any){
    if(data?.idUsuario){
      alert("Usuario creado con el id: "+data.idUsuario);
      this.usuarioNuevo = {};
      this.crearNuevo = false;
      this.cdr.detectChanges();
    }
    else{
      alert("Error al crear usuario, existe un problema en el servidor.")
    }
  }
}