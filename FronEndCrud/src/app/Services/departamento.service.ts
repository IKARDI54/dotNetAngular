import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Departamento} from '../Interfaces/departamento';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private endpoint:string = environment.endPoint;
  private apirUrl:string = this.endpoint + "departamento/";

  constructor(private http:HttpClient) { }

  getList():Observable<Departamento[]>{
    return this.http.get<Departamento[]>(`${this.apirUrl}lista`);
  }
}
