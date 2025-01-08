import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { BillsService } from '../../services/bills.service';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { response } from 'express';
import { AuthapisService } from '../../services/authapis.service';

@Component({
  selector: 'app-newbill',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './newbill.component.html',
  styleUrls: ['./newbill.component.scss']
})
export class NewbillComponent implements OnInit {
  dataMunicipios: any;
  dataRangos: any;
  dataTributos: any;
  dataFacturaGenerada: any;
  validationError = '';
  validationok = '';
  validationDanger= '';

  products: any[] = [];
  // Inicialización del formulario dentro del constructor
  form: FormGroup;
  productForm: FormGroup;
  productFormcustomer: FormGroup;
  showProductForm = false;


  constructor(private billsService: BillsService, private fb: FormBuilder) {
    this.form = this.fb.group({
      numbering_range_id: ['',[Validators.required]],
      reference_code: [`PORRAS${Math.floor(Date.now() / 1000)}`], // Genera el código dinámicamente
      observation: [``],
      payment_form: [`1`],
      payment_due_date: ['2025-01-06'],
      payment_method_code: [`10`],
      billing_period: {
        start_date: "2024-01-10",
        start_time: "00:00:00",
        end_date: "2024-02-09",
        end_time: "23:59:59"
      }
    });

    this.productFormcustomer = this.fb.group({
      identification: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      dv: "3",
      company: [{ value: 'PORRAS S.A', disabled: true }, Validators.required],
      trade_name: "",
      names: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      legal_organization_id: "2",
      tribute_id: ['21', Validators.required],
      identification_document_id: ['', Validators.required],
      municipality_id: ['', Validators.required]
    });


    this.productForm = this.fb.group({
      code_reference: `${Math.floor(10000 + Math.random() * 90000)}`,
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      quantity: [1,[Validators.required]],
      discount_rate: [0],
      price: ['',[Validators.required, Validators.minLength(3)]],
      tax_rate: ['19.00',[Validators.required, Validators.minLength(3)]],
      unit_measure_id: [70],
      standard_code_id: [1],
      is_excluded: [0],
      tribute_id: [1],
      withholding_taxes: [[]],
    });


  }

  ngOnInit(): void {
    this.getMunicipios();
    this.getRangos();
    this.getTributes();

  }

  filterOnlyNumbers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    this.form.get('phone')?.setValue(inputElement.value);
  }

  toggleProductForm() {
    this.showProductForm = !this.showProductForm;
  }
  onAddProduct() {
    if (this.productForm.valid) {
      const newProduct = this.productForm.value;
      const taxMultiplier = 1 + parseFloat(newProduct.tax_rate) / 100;
      newProduct.total = newProduct.quantity * newProduct.price ;

      this.products.push(newProduct);
      this.showProductForm = false;
    }else{
      Object.keys(this.productForm.controls).forEach(field => {
        const control = this.productForm.get(field);
        control?.markAsTouched({ onlySelf: true });
    });
    }

  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
  }

  getTotal() {

    return this.products.reduce((sum, product) => sum + product.total, 0);
  }

  getMunicipios() {
    this.billsService.getMunicipios().subscribe(
      (response) => {
        console.log('MUNICIPIOS:', response.data);
        this.dataMunicipios = response.data;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  getRangos() {
    this.billsService.getRanges().subscribe(
      (response) => {
        console.log('RANGOS:', response.data);
        this.dataRangos = response.data;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  getTributes() {
    this.billsService.getTributes().subscribe(
      (response) => {
        console.log('TRIBUTOS:', response.data);
        this.dataTributos = response.data;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }


  crearFactura(body :Object) {

    const body2 = this.form
    this.billsService.generarFactura(body).subscribe(
      (response ) => {
        console.log('FACTURA GENERADA:', response.data);
        this.dataFacturaGenerada = response.data;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  onSubmit() {


    if (this.productFormcustomer.invalid || this.form.invalid ) {
        Object.keys(this.productFormcustomer.controls).forEach(field => {
            const control = this.productFormcustomer.get(field);
            control?.markAsTouched({ onlySelf: true });
        });

        Object.keys(this.form.controls).forEach(field => {
          const control = this.form.get(field);
          control?.markAsTouched({ onlySelf: true });
      });

        this.validationError = 'Revisa los campos obligatorios del formulario.';
    } else if (this.products.length === 0) {
        this.validationError = 'Debe agregar al menos un producto.';
    } else {
        const facturaData = {
            ...this.form.getRawValue(),
            customer: this.productFormcustomer.value,
            items: this.products,
        };

        console.log('Factura a enviar:', facturaData);
        this.billsService.generarFactura(facturaData).subscribe(
          (response) => {
              if (response) {
                  console.log('Factura generada correctamente:', response);
                  this.form.reset();
                  this.productFormcustomer.reset();
                  this.productForm.reset();
                  this.products = [];
                  this.dataFacturaGenerada = response;
                  this.validationok = 'Factura generada con éxito \n' + response.message;
              } else {
                  console.error('Error al generar la factura: Código', response.status);
                  this.validationError = `Error al generar la factura. Código: ${response.status}`;
              }
          },
          (error) => {

                  this.validationError = 'Conflicto al generar la factura.  ' + JSON.stringify(error.error.message) + (error.error.data ? JSON.stringify(error.error.data.errors) : '');

          }
      );

        setTimeout(() => {
          this.validationDanger = '';
          this.validationError = '';
          this.validationok = '';
        }, 12000);


        this.validationError = '';
    }
}


}
