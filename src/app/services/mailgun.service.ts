import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MailgunService {
  private domain = ''; // Reemplaza con tu dominio
  private apiKey = ''; // Reemplaza con tu API Key de Mailgun

  constructor(private http: HttpClient) {}

  // Método para enviar correo utilizando Angular HttpClient
  sendEmail(to: string, subject: string, text: string): Promise<any> {
    // Configuración de los headers para la autenticación
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa('api:' + this.apiKey)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Creación del cuerpo del mensaje en formato URL encoded
    const body = new URLSearchParams();
    body.set('from', 'beLoved <mailgun@>');
    body.set('to', to);
    body.set('subject', subject);
    body.set('text', text);

    const url = `https://api.mailgun.net/v3/${this.domain}/messages`;

    // Envío del correo con HttpClient
    return this.http.post(url, body.toString(), { headers }).toPromise()
      .then(response => {
        console.log('Correo enviado exitosamente:', response);
        return response;
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
        throw error;
      });
  }
}
