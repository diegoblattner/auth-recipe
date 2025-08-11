
import Handlebars from "handlebars";
import { Layout } from "../../layout.js";

type LoginFormCtx = {
  email: string;
  password: string;
  error?: {
    email?: string;
    password?: string;
    global?: string;
  };
};

const loginFormHtml = 
`<form method="POST" action="/login">
  <fieldset>
    <legend>Log in form</legend>
    <div>
      <label>
        <span>email:</span>
        <input name="email" type="email" value="{{email}}" />
      </label>
      {{#if error.email}}
      <span>{{error.email}}</span>
      {{/if}}
    </div>
    <div>
      <label>
        <span>password:</span>
        <input name="password" type="password" value="{{password}}" />
      </label>
      {{#if error.password}}
      <span>{{error.password}}</span>
      {{/if}}
    </div>
  </fieldset>
  <button>Log in</button>
  {{#if error.global}}
  <p>{{error.global}}</p>
  {{/if}}
</form>
<p>Not yet a user? <a href="/singup">Sign up</a>.</p>
`;

export const LoginForm = Handlebars.compile<LoginFormCtx>(loginFormHtml);

export function LoginPage(...params: Parameters<typeof LoginForm>) {
  return Layout({
    title: "Auth Recipe - Login",
    content: LoginForm(...params),
  });
}
