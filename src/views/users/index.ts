import Handlebars from "handlebars";

type UserDetailsCtx = {
  email: string;
  password: string;
  error?: {
    email?: string;
    password?: string;
    global?: string;
  };
};

const userDetailsHtml =
`<div>
  <p>{{firstName}} {{lastName}}</p>
  <p>{{email}}</p>
  <p>{{email}}</p>
  {{#if roles.length > 0}}
  <ul class="people_list">
    {{#each roles}}
    <li>{{this}}</li>
    {{/each}}
  </ul>
  {{else}}
  <p>No roles attributed yet. An admin user can attribute them as needed.</p>
  {{/if}}
</div>
`;

export const UserDetails = Handlebars.compile<UserDetailsCtx>(userDetailsHtml);
