import { config } from "dotenv";

config();

const REQUIRED = [
  "CLIENT_URL",
  "SESSION_SECRET",
  "MONGO_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL"
] as const;

type Required = (typeof REQUIRED)[number];

const KEYS = [
  ...REQUIRED,

  "PORT",
  "COOKIE_AGE",
  "RESAVE",
  "SAVE_UNINITIALISED"
] as const;

type Keys = (typeof KEYS)[number];

type Unrequired = Exclude<Keys, Required>;
const DEFAULT: Record<Unrequired, string> = {
  PORT: "9001",
  COOKIE_AGE: "604800000",
  RESAVE: "false",
  SAVE_UNINITIALISED: "false",
};

type EnvType = Record<Keys, string>

class Env {
  public static readonly env = {
    ...DEFAULT,
    ...process.env,
  } as (NodeJS.ProcessEnv & EnvType);

  private readonly _keys = Object.keys(process.env);

  public init() {
    for (const key of REQUIRED) {
      const keys = []

      if (!this._keys.includes(key)) {
        keys.push(key)
      };

      if (keys.length !== 0) {
        throw new Error(`keys in your .env are not defined. Define next keys:\n${keys.join(", ")}`)
      };
    }
  }
}

new Env().init();

export { Env };

export default Env;