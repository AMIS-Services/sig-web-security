import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request || !request.url || (/^http/.test(request.url) && !(SERVER_API_URL && request.url.startsWith(SERVER_API_URL)))) {
            return next.handle(request);
        }

        // retrieve the JWT from the storage and add it to the header
        // to change the request, use request = request.clone()

        return next.handle(request);
    }
}
