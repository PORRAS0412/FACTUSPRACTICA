import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthapisService {


  private url_api: string = environment.url_api;
  private email: string = environment.email;
  private password: string = environment.password;
  private client_id: string = environment.client_id;
  private client_secret: string = environment.client_secret;

  constructor(private http:HttpClient) {

  }


  public obtenertoken() :Observable<any> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const body = new HttpParams()
    .set('grant_type', 'password')
    .set('client_id', this.client_id)
    .set('client_secret', this.client_secret)
    .set('username', this.email)
    .set('password', this.password);

    const urlconmpleta = `${this.url_api}/oauth/token`;
    return this.http.post<any>(urlconmpleta, body.toString(), options);
  }


  public refreshtoken(refresh_token  : string) :Observable<any> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const body = new HttpParams()
    .set('grant_type', 'refresh_token')
    .set('client_id', this.client_id)
    .set('client_secret', this.client_secret)
    .set('username', this.email)
    .set('refresh_token', refresh_token);

    const urlconmpleta = `${this.url_api}/oauth/token`;
    return this.http.post<any>(urlconmpleta, body.toString(), options);
  }

}
