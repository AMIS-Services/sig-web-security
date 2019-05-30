import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
    constructor(private http: HttpClient, private $localStorage: LocalStorageService, private $sessionStorage: SessionStorageService) {}

    login(credentials): Observable<any> {
        const data = {
            username: credentials.username,
            password: credentials.password,
            rememberMe: credentials.rememberMe
        };
        return this.http.post(SERVER_API_URL + 'api/authenticate', data, { observe: 'response' }).pipe(map(authenticateSuccess.bind(this)));

        function authenticateSuccess(resp) {
            // get token from message (header)
        }
    }

    storeAuthenticationToken(jwt, rememberMe) {
        // store token in Storage
    }

    logout(): Observable<any> {
        return new Observable(observer => {
            // remove token from Storage

            observer.complete();
        });
    }
}
