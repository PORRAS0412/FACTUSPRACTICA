import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BillsService } from '../../services/bills.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FacturaDetalleComponent } from './factura-detalle/factura-detalle.component';
import { AuthapisService } from '../../services/authapis.service';

export interface dataBills {
  id: number;
  name: string;
  age: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuComponent, FormsModule, CommonModule, MatCardModule, MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Número', 'Cliente', 'email', 'Empresa', 'Identification', 'Creación', 'Total', 'Acciones'];
  dataSource: MatTableDataSource<dataBills>;
  dataBills: any;
  dataBillsDetail: any;
  dataBillsDelete: any;
  validationError = '';
  validationok = '';
  validationDanger = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Asignación definitiva con !
  @ViewChild(MatSort) sort!: MatSort;  // Asignación definitiva con !

  constructor(
    private billsService: BillsService,
    private authapisService: AuthapisService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef // Inyectamos ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<dataBills>([]);  // Inicializa dataSource vacío
  }

  ngOnInit(): void {
    this.getToken();
    this.getbills();

  }

  getToken() {
    this.authapisService.obtenertoken().subscribe(
      (response) => {
        console.log('Token recibido:', response.access_token);
        sessionStorage.setItem('authToken', response.access_token);
        sessionStorage.setItem('refresh_token', response.refresh_token);
        this.getbills()
      },
      (error) => {
        console.error('Error al obtener token:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Asegurarse de que el paginador y el sorter se asignen después de la inicialización del componente
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getbills() {
    this.billsService.getBills().subscribe(
      (response) => {
        console.log('DATA:', response.data.data);  // Asegúrate de que la API te esté enviando una lista
        // Aquí asignas correctamente la data a MatTableDataSource
        this.dataSource.data = response.data.data;  // Asigna la data a la propiedad 'data' de MatTableDataSource
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  getBillDetaile(number: string) {
    this.billsService.getBillDetaile(number).subscribe(
      (response) => {
        console.log('DATADETALLEFACTURA:', JSON.stringify(response.data));
        this.dialog.open(FacturaDetalleComponent, {
          width: '400px',
          data: response.data, // Aquí pasas los datos al modal
        });
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  DeleteBill(reference_code: string) {
    this.billsService.DeleteBill(reference_code).subscribe(
      (response) => {
        console.log('DATAELIMINARFACTURA OK:', JSON.stringify(response));
        this.validationok = 'Factura eliminada correctamente: ' + response.message;

        // Forzamos la detección de cambios
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
       // this.validationError = 'No se logró eliminar la factura.';
        this.validationError = 'No se logro eliminar la factura ' + JSON.stringify(error.error.message) + (error.error.data ? JSON.stringify(error.error.data.errors) : '');
        // Forzamos la detección de cambios
        this.cdRef.detectChanges();
      }
    );

     setTimeout(() => {
          this.validationDanger = '';
          this.validationError = '';
          this.validationok = '';
        }, 12000);
  }


}
