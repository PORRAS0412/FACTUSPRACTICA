import { Injectable } from '@angular/core';
import { environment } from '../enviroment/enviroment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  private url_api: string = environment.url_api;
  private email: string = environment.email;
  private password: string = environment.password;
  private client_id: string = environment.client_id;
  private client_secret: string = environment.client_secret;

  constructor(private http:HttpClient) { }

  public getBills() :Observable<any> {
    const urlconmpleta = `${this.url_api}/v1/bills`;
    return this.http.get<any>(urlconmpleta);
  }

 public getBillDetaile(number : String) :Observable<any> {
    const urlconmpleta = `${this.url_api}/v1/bills/show/${number}`;
    return this.http.get<any>(urlconmpleta);
  }

  public DeleteBill(reference_code : String) :Observable<any> {
    const urlconmpleta = `${this.url_api}/v1/bills/destroy/reference/${reference_code}`;
    return this.http.delete <any>(urlconmpleta);
  }

  public getMunicipios() :Observable<any> {
     const urlconmpleta = `${this.url_api}/v1/municipalities`;
     return this.http.get<any>(urlconmpleta);
  }


  public dowlandbill(number : String) :Observable<any> {
    const urlconmpleta = `${this.url_api}/v1/bills/download-pdf/${number}`;
    return this.http.get<any>(urlconmpleta);
 }






   public getRanges() :Observable<any> {
     const urlconmpleta = `${this.url_api}/v1/numbering-ranges`;
     return this.http.get<any>(urlconmpleta);
   }

   public getTributes() :Observable<any> {
     const urlconmpleta = `${this.url_api}/v1/tributes/products`;
     return this.http.get<any>(urlconmpleta);
   }


   public generarFactura(body :Object) :Observable<any> {
    const urlconmpleta = `${this.url_api}/v1/bills/validate`;
    return this.http.post<any>(urlconmpleta,body);
  }


}
