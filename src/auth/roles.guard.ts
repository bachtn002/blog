import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/users/role.decorator";
import { Role } from "src/users/role.enum";
import { User } from "src/users/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {

    }
    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requireRoles) {
            return true;
        }
        const { user }: { user: User }  = context.switchToHttp().getRequest();
        return requireRoles.some((role) => user.Role?.includes(role));
    }
}