<!DOCTYPE html>
<html>
  <head>
    <title>Users List</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Users List</h1>
    <p class="error">{{msg}}</p>
    {{#users}}
    <p>
      <strong>{{id}}</strong>: {{firstName}} {{lastName}}
      <a href="{{id}}.html">details</a>
    </p>
    {{/users}}
    {{>footer}}
  </body>
</html>
