import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '../';
import { LoginModalService } from '../login/login-modal.service';
import { StateStorageService } from './state-storage.service';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService implements CanActivate {
    constructor(
        private router: Router,
        private loginModalService: LoginModalService,
        private accountService: AccountService,
        private stateStorageService: StateStorageService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const authorities = route.data['authorities'];

        // check if authorities are required, return true otherwise

        // check if the user is logged in (use this.accountService)
        // BONUS: if not, show the login form (use this.loginModalService)

        // check if the user has the required authorities (use this.accountService.hasAnyAuthority())

        return true;
    }
}
