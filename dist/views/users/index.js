import Handlebars from "handlebars";
const userDetailsHtml = `<div>
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
export const UserDetails = Handlebars.compile(userDetailsHtml);
