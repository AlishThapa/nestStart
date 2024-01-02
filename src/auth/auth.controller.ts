import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

//decorator vaneko chahi @Controller ho logic implementation garna lai
//controller is responsible for handeling incoming request and returning responses
@Controller('auth')
//auth jun rakheko xa tyo vaneko global route vanxa
//meaning POST/auth/signup or signin hunxa instead of POST/signup or POST/signin
export class AuthController {
    constructor(private authService: AuthService) {
        //aba jun service vanne ma banako test fn thyo tyo access esari garinxa7
        //yei lai dependency injection vaninxa
        // this.authService.test();
    }
    @Post('signup')

    // yo chahi not recommended since paxi changes garna paryo vane it'll be next to impossible
    // signUp(@Req() req:Request) {
    //     console.log(req.body);
    //     return this.authService.signup();
    // }


    /*so using this*/

    signUp(@Body() dto: AuthDto) {
        console.log(dto,);
        return this.authService.signup(dto);
    }

    //tara aba etai bata validation garna paryo vane
    // signUp(
    //     @Body('email') email: string,
    //     @Body('password', ParseIntPipe) password: string
    // ) {
    //     console.log({email,
    //         typeOfEmail: typeof email,
    //         password,
    //         typeofPassword : typeof password,
    //         });
    //     return this.authService.signup();
    // }



    @Post('signin')
    signIn(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}

// yo tala ko code use garnu ko satta     constructor(private authService : AuthService){} yo use hunxa
// easy
// const authService = new AuthService() 

