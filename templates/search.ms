<!DOCTYPE html>
<html>
  <head>
    <title>Document Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Document Search</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/search.html">
       <p>Please fill in one or more of the search terms in the field below</p>
	{{#fields}}
	  {{#isSearch}}
	    <label>
	    <span class="label">{{friendlyName}}:</span>
	    <input id="query" name="{{name}}" {{#type}} type="{{type}}"{{/type}} value="{{value}}">
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
	 {{/fields}}
      <input id="submit" name="submit" type="submit" value="search" class="control">
    </form>

    {{#resultFields}}
        <div class="fieldsWrapper">
            <a class="resultNodeLink" href="{{docLink}}">{{name}}</a>
            {{#lines}}<span class="resultLine">{{.}}</span>{{/lines}}
        </div>
    {{/resultFields}}
    {{#next}}
        <a class="resultNodeLink" href="{{nextValue}}">next</a>
    {{/next}}
    {{#prev}}
        <a class="resultNodeLink" href="{{previousValue}}">previous</a>
    {{/prev}}

    {{>footer}}
  </body>
</html>
