import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { BillsService } from '../../../services/bills.service';
@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss'
})
export class FacturaDetalleComponent {

  datapdf : any
  constructor(
    private billsService: BillsService,
    public dialogRef: MatDialogRef<FacturaDetalleComponent>, // Inyecta el MatDialogRef
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe los datos de la factura
  ) {}


  onClose(): void {
    this.dialogRef.close();
  }


  dowlandbill(number: string) {
    this.billsService.dowlandbill(number).subscribe(
      (response) => {
        console.log('DATOS PDF:', JSON.stringify(response.data));
        const { file_name, pdf_base_64_encoded } = response.data;

        // Convertir Base64 a Blob
        const byteCharacters = atob(pdf_base_64_encoded);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Crear un enlace temporal para la descarga
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `${file_name}.pdf`;
        link.click();

        // Liberar la memoria
        URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

}
