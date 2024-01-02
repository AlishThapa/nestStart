import { ForbiddenException, Injectable, Req } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

//service use garna lai chahi decorator use huney vaneko Injectable ho
//services or providers are responsible for executing business logic
//Dependency Injection garna easy garauxa
@Injectable()
export class AuthService{
    // test(){}
   constructor(private prisma  : PrismaService){}
   async signup(dto: AuthDto) {
    // signup garda starting ma password hash garney just to be sure of security
    const hash = await argon.hash(dto.password);
    // tespasxi save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        //select garda chahi k hunxa vane junjun true gareko xa tyo matra dekhauxa json ma 
        // select:{
        //     email:true,
        //     hash:true,
        //     id:true
        // }
      });

      return user;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // signin garda first ma checking if email xa xaina
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    // if email vetena vane, throw exception
    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    // email xa vane aba compare if tyo email sanga associated password milxa mildaina
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    // if password milena vane, throw exception
    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    return user;
  }


}




//IF DATABASE CONNECT VAYENA VANERA ERROR AYO VANE FIRST MA
//PORT MILEKO XA XAINA HERNEY
//2ND MA TMLE PRISMA UPDATE GAREKO XA XAINA 
//COMMAND IS npx prisma studio