
import Handlebars from "handlebars";
import { Layout } from "../../layout";

type LoginFormCtx = {
  email: string;
  password: string;
  error?: {
    email?: string;
    password?: string;
    global?: string;
  };
};

// function getInputHtml(ctx: InputCtx) {
//   return inputHtml
//     .replaceAll("{{label}}", ctx.label)
//     .replaceAll("{{name}}", ctx.name)
//     .replaceAll("{{type}}", ctx.type)
//     .replaceAll("{{value}}", ctx.value)
//     .replaceAll("{{#if error}}", `{{#if ${ctx.error.replaceAll("{{", "").replaceAll("}}", "")}}}`)
//     .replaceAll("{{error}}", ctx.error);
// }

const inputHtml =
`<div>
  <label>
    <span>{{label}}</span>
    <input name="{{name}}" type="{{type}}" value="{{value}}" />
  </label>
  {{#if error}}
  <span>{{error}}</span>
  {{/if}}
</div>
`;

type InputCtx = {
  label: string;
  name: string;
  type: string;
  value: string;
  error: string;
};

const Input = Handlebars.compile<InputCtx>(inputHtml);

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
<p>Forgot your password? <a href="/forgot-password">Reset your password</a>.</p>
`;

export const LoginForm = Handlebars.compile<LoginFormCtx>(loginFormHtml);

export function LoginPage(...params: Parameters<typeof LoginForm>) {
  return Layout({
    title: "Auth Recipe - Login",
    content: LoginForm(...params),
  });
}

type ForgotPasswordCtx = {
  email: string;
  link: string;
  error?: {
    email?: string;
    global?: string;
  };
};

const forgotPasswordFormHtml = `
{{#if email}}
  <p>If the e-mail provided is valid, an e-mail will be sent to your inbox with a link to reset your password.</p>
{{else}}
  <form method="POST" action="/forgot-password">
    <fieldset>
      <legend>Forgot password</legend>
      <div>
        <label>
          <span>email:</span>
          <input name="email" type="email" value="{{email}}" />
        </label>
        {{#if error.email}}
        <span>{{error.email}}</span>
        {{/if}}
      </div>
    </fieldset>
    <button>Send reset link</button>
  </form>
{{/if}}
{{#if error.global}}
  <p>{{error.global}}</p>
{{/if}}
  {{#if link}}
    <p>
      Here follows the link that would be sent to your e-mail in a production environment.
      <br/>For this exemple we will just leave it here so you can click it and reset your password:
      <br/><a href="{{link}}" target="_blank">Reset password</a>
    </p>
  {{/if}}
`;

const ForgotPasswordForm = Handlebars.compile<ForgotPasswordCtx>(forgotPasswordFormHtml);
export function ForgotPasswordPage(...params: Parameters<typeof ForgotPasswordForm>) {
  return Layout({
    title: "Auth recipe - Forgot password",
    content: ForgotPasswordForm(...params),
  });
}

type ResetPasswordFormCtx = {
  token: string;
  email: string;
  password: string;
  passwordConfirm: string;
  error?: {
    email?: string;
    password?: string;
    passwordConfirm?: string;
    global?: string;
  };
};

const resetPasswordFormHtml = 
`<form method="POST" action="/reset-password/{{token}}">
  <fieldset>
    <legend>Reset your password</legend>
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
        <span>new password:</span>
        <input name="password" type="password" value="{{password}}" />
      </label>
      {{#if error.password}}
      <span>{{error.password}}</span>
      {{/if}}
    </div>
    <div>
      <label>
        <span>confirm new password:</span>
        <input name="passwordConfirm" type="password" value="{{passwordConfirm}}" />
      </label>
      {{#if error.passwordConfirm}}
      <span>{{error.passwordConfirm}}</span>
      {{/if}}
    </div>
  </fieldset>
  <button>Update password</button>
  {{#if error.global}}
  <p>{{error.global}}</p>
  {{/if}}
</form>
`;

export const ResetPasswordForm = Handlebars.compile<ResetPasswordFormCtx>(resetPasswordFormHtml);

export function ResetPasswordPage(...params: Parameters<typeof ResetPasswordForm>) {
  return Layout({
    title: "Auth Recipe - Reset password",
    content: ResetPasswordForm(...params),
  });
}
