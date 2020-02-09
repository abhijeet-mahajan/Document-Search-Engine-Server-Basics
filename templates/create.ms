<!DOCTYPE html>
<html>
  <head>
    <title>Add Content</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Add Content</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="Get" action="{{{base}}}/create.html">
       <p>
	 Please fill in the details
        </p>
	{{#fields}}
	    <label>
	    <span class="label">
	      {{#isRequired}}* {{/isRequired}}{{friendlyName}}:
	    </span>
	    <input name="{{name}}" type="file">
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	 {{/fields}}
      <input name="submit" type="submit" value="create" class="control">
    </form> 
    {{>footer}}
  </body>
</html>
