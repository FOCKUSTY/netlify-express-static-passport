import { Env } from "env";

import router from "routes";

import passport, { Profile } from "passport";

import express, { Express } from "express";
import session from 'express-session';
import cors from "cors";

import { auth } from "database/index";

import { Strategy } from "passport-google-oauth20";
import type { VerifyCallback } from "passport-oauth2";

const { env } = Env;

class Passport {
  public constructor() {
      this.init();
  };
  
  private readonly init = () => {
      passport.serializeUser((user: any, done) => {
        return done(null, user.id);
      }); 
      
      passport.deserializeUser(async (id: string, done) => {
          try {
              const user = await auth.default.findOne({ id });
              
              return user
                ? done(null, user)
                : done(null, null);
          } catch (err) {
              console.error(err);
          
              return done(err, null);  
          };
      });

      passport.use(new Strategy({
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL,
          scope: ['identify', 'email', 'guilds']
          }, async (
                  access_token: string,
                  _: string,
                  profile: Profile,
                  done: VerifyCallback
              ) => {
                  const { id, displayName } = profile;
                  try {
                      const existingUser = await auth.default.findOneAndUpdate(
                        { id },
                        { access_token, name: displayName },
                        { new: true },
                      );
      
                      if(existingUser)
                          return done(null, existingUser);
          
                      const newUser = new auth.default({ access_token, id, name: displayName });
                      const savedUser = await newUser.save();

                      return done(null, savedUser);
                  }
                  catch (err) {
                      console.error(err);
                      return done(err as any, undefined)
                  };
              }
      ));
  };
  public readonly initialize = () => {
      return passport.initialize();
  };
  
  public readonly session = () => {
      return passport.session();
  };
  public get passport () {
      return passport;
  };
};

class Session {
  public constructor(public readonly app: Express = express()) {};

  public create = () => {
    this.app.use(session({
      secret: env.SESSION_SECRET,
      resave: Boolean(env.RESAVE),
      saveUninitialized: Boolean(env.SAVE_UNINITIALISED),
      cookie: { maxAge: Number(env.COOKIE_AGE) },
    }));
  };
};

class App {
  public constructor(
    public readonly app: Express,
    public readonly prefix: string = ""
  ) {};

  public listen() {
    this.init();
    const port = env.PORT;

    this.app.listen(port, () => {
      console.log("Server starting: http://localhost:"+port);
    });
  }

  private init() {
    const google = new Passport();

    this.app.use(cors({  origin: [ env.CLIENT_URL ], credentials: true }));

    this.app.use(express.json());
    this.app.use(express.urlencoded());

    this.app.use(google.session());
    this.app.use(google.initialize());

    new Session(this.app);

    this.app.use("/" + this.prefix, router);
  };
}

export { App };

export default App;
