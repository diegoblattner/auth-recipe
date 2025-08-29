import { Hono, type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { findUser, findUserByEmail } from "./users";
import { MemorySession } from "./memorySession";
import { ForgotPasswordPage, LoginPage, ResetPasswordPage } from "./views/auth";
import type { User } from "./db";

type HonoEnv = {
  Bindings: {},
  Variables: {
    user: User | null;
    sessionId: string | null;
  },
};

type SessionObj = {
  id: string;
  user: User;
  expiresAt: number;
};

const app = new Hono<HonoEnv>();

const memorySession = new MemorySession<string, SessionObj>();

app.use((c, next) => { // runs for all routes
  let sessionId = getCookie(c, SESSION_COOKIE) ?? null;
  let user: User | null = null;
  
  if (sessionId) {
    const found = memorySession.get(sessionId);
    if (found) {
      user = found.user;
    }
  }

  c.set("user", user);
  c.set("sessionId", sessionId);
  return next();
});

app.get("/", (c) => {
  const user = c.get("user");
  if (user) {
    return c.text(`Hello, ${user.firstName}!`);
  } else {
    return c.redirect("/login");
  }
});

const SESSION_COOKIE = "session";

app.get("/login", (c) => {
  if (c.get("user")) { // already logged in
    return c.redirect("/");
  }

  const loginPage = LoginPage({ email: "", password: "" });
  return c.html(loginPage);
});

function isJSON<T extends Context<HonoEnv>>(c: T) {
  return c.req.header("Content-Type") === "application/json";
}

app.post("/login", async (c) => {
  const formData = await c.req.formData();
  const email = (formData.get("email") ?? "") as string;
  const password = (formData.get("password") ?? "") as string;
  const rememberMe = formData.get("rememberMe");

  if (!email && !password) {
    if (isJSON(c)) {
      return c.json({ msg: "invalid" }, 401); // TODO find status code
    } else {
      return c.html(LoginPage({
        email,
        password,
        error: {
          email: email ? undefined : "email is required",
          password: password ? undefined : "password is required",
        }
      }));
    }
  }
  
  const user = findUser(email, password);

  if (!user) {
    if (isJSON(c)) {
      return c.json({ msg: "unauthorized" }, 401); // TODO find status code
    } else {
      return c.html(LoginPage({
        email,
        password,
        error: {
          global: "invalid credentials",
        }
      }));
    }
  }

  // TODO create session
  const sessionId = "TODO create new session ID:" + Date.now();
  const expiresAt = Date.now() +  5 * 60 * 1000;
  memorySession.set(sessionId, {
    id: sessionId,
    user: user,
    expiresAt,
  });

  // TODO add to cookie
  setCookie(c, SESSION_COOKIE, sessionId, {
    secure: true,
    maxAge: 1000,
    expires: new Date(expiresAt),
  });

  if (isJSON(c)) {
    return c.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      verified: user.verified,
    }, 200);
  } else {
    return c.redirect("/");
  }
});

app.on(["GET", "POST"], "/logout", (c) => {
  const sessionId = c.get("sessionId");
  if (sessionId) {
    memorySession.delete(sessionId);
  }

  deleteCookie(c, SESSION_COOKIE);
  
  if (isJSON(c)) {
    return c.json({ msg: "success" }, 200);
  } else {
    return c.redirect("/login");
  }
});

function getPasswordResetToken(token: string) {
  const valid = true; // TODO validate token
  
  if (!valid) return;

  return {
    token: "",
    email: "",
  };
}

app.get("/forgot-password", (c) => {
  return c.html(ForgotPasswordPage({ email: "", link: "" }));
});

app.post("/forgot-password", async (c) => {
  const formData = await c.req.formData();
  const email = (formData.get("email") ?? "") as string;

  let link = "";

  const user = findUserByEmail(email);

  if (user) {
    link = "/reset-password/TODO-make-link-hash";
  }

  return c.html(ForgotPasswordPage({ email, link }));
});

app.get("/reset-password/:token", (c) => {
  const token = c.req.param('token');

  const tokenData = getPasswordResetToken(token);
  
  if (tokenData) {
    return c.html(ResetPasswordPage({
      token,
      email: "",
      password: "",
      passwordConfirm: ""
    }));
  } else {
    return c.html("invalid token");
  }
});

app.post("/reset-password/:token", async (c) => {
  const token = c.req.param('token');
  const formData = await c.req.formData();
  const tokenData = getPasswordResetToken(token);
  const email = (formData.get("email") ?? "") as string;
  const password = (formData.get("password") ?? "") as string;
  const passwordConfirm = (formData.get("passwordConfirm") ?? "") as string;

  let tokenError: string = "";
  let emailError: string = "";
  let passwordError: string = "";
  let passwordConfirmError: string = "";

  if (!tokenData) {
    tokenError = "invalid token";
  }

  if (tokenData?.email !== email) {
    emailError = "incorrect email address";
  }

  if (password != passwordConfirm) {
    passwordConfirmError = "passwords don't match";
  }

  if (!tokenError && !emailError && !passwordError && !passwordConfirmError) {
    if (isJSON(c)) {
      return c.json({ message: "success" });
    } else {
      // Success page?
      return c.redirect("/login");
    }
  } else {
    if (isJSON(c)) {
      return c.html(ResetPasswordPage({
        token,
        email: "",
        password: "",
        passwordConfirm: ""
      }));
    } else {
      return c.html(ResetPasswordPage({
        token,
        email,
        password,
        passwordConfirm,
        error: {
          email: emailError,
          password: passwordError,
          passwordConfirm: passwordConfirmError,
          global: tokenError,
        }
      }));
    }
  }
});

export default { 
  port: 3000, 
  fetch: app.fetch, 
} 

// serve with node:
// serve({
//   fetch: app.fetch,
//   port: 3000
// }, (info) => {
//   console.log(`Server is running on http://localhost:${info.port}`)
// })
