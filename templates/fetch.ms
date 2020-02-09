<!DOCTYPE html>
<html>
  <head>
    <title>Get File Content</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Get File Content</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/fetch.html">
       <p>
	 Please fill in one or more of the following fields
        </p>
	{{#fields}}
	    <label>
	    <span class="label">{{friendlyName}}:</span>
	    {{#isId}}
	      {{value}}
	      <input name="{{name}}" type="{{type}}" value="{{value}}">
	    {{/isId}}
	    {{^isId}}
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
	    {{/isId}}
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	 {{/fields}}
      <input name="submit" type="submit" value="update" class="control">
    </form> 
    {{>footer}}
  </body>
</html>
