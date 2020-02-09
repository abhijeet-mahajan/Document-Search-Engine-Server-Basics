<!DOCTYPE html>
<html>
  <head>
    <title>User Details</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>User Details</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    {{#users}}
      <dl>
        {{#fields}}
	  {{#value}}
          <dt>{{name}}</dt>
          <dd>{{value}}</dd>
	  {{/value}}
	{{/fields}}
	<a href="{{{base}}}/update.html?id={{{id}}}"><button>update</button></a>
	<form method="POST" action="{{{base}}}/delete" class="inline">
          <input type="hidden" name="id" value="{{id}}">
	  <input type="submit" name="submit" value="delete">
        </form>
      </dl>
    {{/users}}
    {{>footer}}
  </body>
</html>
