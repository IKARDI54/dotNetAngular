import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { Empleado } from './Interfaces/empleado';
import { EmpleadoService } from './Services/empleado.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { DialogAddEditComponent } from './Dialogs/dialog-add-edit/dialog-add-edit.component';
import { DialogoDeleteComponent } from './Dialogs/dialogo-delete/dialogo-delete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['NombreCompleto', 'Departamento', 'Sueldo', 'FechaContrato','Acciones'];
  dataSource = new MatTableDataSource<Empleado>();
constructor(
  private _empleadoServicio:EmpleadoService,
  public dialog: MatDialog,
  private _snackBar : MatSnackBar
  ){

  }

  ngOnInit(): void {
   this.mostrarEmpleados();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarEmpleados(){
    this._empleadoServicio.getList().subscribe({
      next: (dataResponse) => {
        console.log(dataResponse)
        this.dataSource.data = dataResponse;
      },
      error: (err) => {
        console.error('Error al obtener los empleados', err);
      }
    });
  }

  dialogoNuevoEmpleado(){
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      width:'350px'
    }).afterClosed().subscribe(resultado=>{
      if(resultado=="creado"){
        this.mostrarEmpleados();
      }
    });
  }

  dialogoEditarEmpleado(dataEmpleado:Empleado){
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      width:'350px',
      data:dataEmpleado
    }).afterClosed().subscribe(resultado=>{
      if(resultado=="EmpleadoEditado"){
        this.mostrarEmpleados();
      }
    });
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000,
    });
  }

  dialogoEliminarEmpleado(dataEmpleado:Empleado){

    this.dialog.open(DialogoDeleteComponent,{
      disableClose:true,
      data:dataEmpleado
    }).afterClosed().subscribe(resultado=>{
      if(resultado=="eliminar"){
        this._empleadoServicio.delete(dataEmpleado.idEmpleado).subscribe({
          next:(data) => {
            this.mostrarAlerta('Empleado eliminado correctamente', 'OK');
            this.mostrarEmpleados();
          },
          error: (err) => {
            console.error('Error al eliminar el empleado', err);
            this.mostrarAlerta('Error al eliminar el empleado', 'ERROR');
          }
          
        })
      }
    });
  }
}


