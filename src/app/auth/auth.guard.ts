import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

// CanActivate interface helps to protect routes
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.authService.getIsAuth();
        if (!isAuth) {
            this.router.navigate(['/auth/login']);
        }
        return isAuth;
    }

}