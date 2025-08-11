import { serve } from "@hono/node-server"
import { Hono, type Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { findUser } from "./users";
import { MemorySession } from "./memorySession";
import { LoginPage } from "./views/auth";
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


// serve with node:
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

// // serve with bun:
// export default { 
//   port: 3000, 
//   fetch: app.fetch, 
// } 
