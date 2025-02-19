export class LoginResponseModel {
    username: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    foto: string;
    listaMenu: [];

    success: boolean;
    errorMessage: string;
}
