import Handlebars from "handlebars";
const layoutHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
  </head>
  <body>
    {{{content}}}
  </body>
</html>
`;
export const Layout = Handlebars.compile(layoutHtml);
