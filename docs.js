'use strict';

const express = require('express');
const upload = require('multer')();
const fs = require('fs');
const mustache = require('mustache');
const Path = require('path');
const { URL } = require('url');
const querystring = require('querystring');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(port, base, model) {
  console.log("Inside serve");
  const app = express();
  app.locals.port = port;
  //  console.dir("im here");
  app.locals.model = model;
  app.locals.base = base;
  process.chdir(__dirname);
  app.use(base, express.static(STATIC_DIR));
  setupTemplates(app, TEMPLATES_DIR);
  setupRoutes(app);
  app.listen(port, function () {
    console.log(`listening on port ${port}`);
  });
}


module.exports = serve;

/******************************** Routes *******************************/

function setupRoutes(app) {
  const base = app.locals.base;
  console.log("Inside setup routes: ", base);


  app.get(`${base}/index.html`, getHomePage(app));
  app.get(`${base}/create.html`, addContentForm(app));//ADD
  app.get(`${base}/search.html`, searchContentForm(app));
  app.get(`${base}/:id.html`, getConentForm(app)); //must be last
}

/*************************** Action Routines ***************************/

//@TODO add action routines for routes + any auxiliary functions.

function getConentForm(app) {
  return async function (req, res) {
    let results = [];
    let template, model, html;
    const isSubmit = req.query.submit !== undefined;
    let fileName = getNonEmptyValues(req.query);
    console.log("filename ->  issubmit -> " + isSubmit);
    if (isSubmit) {
      fileName="test2";
      let data = await app.locals.model.getContent(fileName);
      let resultFields={"name" : fileName , "type":"This is the file content" };
      model = { base: app.locals.base, fields: resultFields };
    } else {
      model = { base: app.locals.base, fields: FIELDS };
    }
    html = doMustache(app, 'fetch', model);
    res.send(html);
  };
}

function searchContentForm(app) {
  return async function (req, res) {
    let results = [];
    let data = {};
    let query;
    let errors = undefined;
    const isSubmit = req.query.submit !== undefined;
    const searchTerms = getNonEmptyValues(req.query);
    delete searchTerms.submit;

    if (isSubmit)
    {
      if (Object.keys(searchTerms).length == 0) {
        const msg = 'at least one search parameter must be specified';
        errors = Object.assign(errors || {}, { _: msg });
      }
      if (!errors) {
        query = querystring.stringify(searchTerms);
        try {
          data = await app.locals.model.list(query);
          results = data.results;
        }
        catch (err) {
          console.error(err);
          errors = wsErrors(err);
        }
        if (results.length === 0) {
          errors = { _: 'no users found for specified criteria; please retry' };
        }
      }
    }

    let model, template;
    if (results.length > 0) {
      template = 'search';
//      searchTerms.forEach(x =>)
//       results.map(result => )

      const resultSearchFields = results.map((u) => ({
          name: u.name,
          docLink:`${app.locals.base}/${u.name}`,
          lines:u.lines//.map(line => line.replace('Snark', '<span style="color:green">yes</span>'))
      }));
      model = { base: app.locals.base, fields:fieldsWithValues(searchTerms),
          resultFields: resultSearchFields, isSearch:"true", name:"something", value:searchTerms.q, next:"balh",
          nextValue:"www.google.com",previousValue:"www.google.com", prev:"balh"
      };
    }

    else {
      template = 'search';
      model = errorModel(app, searchTerms, errors);
    }
    const html = doMustache(app, template, model);
    res.send(html);
  };
}


function addContentForm(app) {
  return async function (req, res) {
    let model,html,isAdd;

    isAdd= req.query.submit !== undefined;

    if(isAdd){
      console.log("Add if");
      let document={ "name" : "text3" , content:"Some random text content" };
      let data = await app.locals.model.addContent(document);
      console.log("Data created -> ");
      console.dir(data);
      model = { base: app.locals.base, fields: FIELDS };
      html = doMustache(app, 'create', model);

    }else{
      console.log("Add Else");
      model = { base: app.locals.base, fields: FIELDS };
      html = doMustache(app, 'create', model);
      }
    res.send(html);
  };
}


function getHomePage(app) {
  return async function (req, res) {
    //    console.dir("im getHomePage");
    const model = { base: app.locals.base, fields: FIELDS };
    // const html = doMustache(app, 'create', model);
    //   let sHTML = `<html lang="en">
    //   <head>
    //     <title>Users Homepage</title>
    //   </head>
    //   <body>
    //     <h1>Users Homepage</h1>
    //     <p><a href="create.html">Create</a> a new user</p>
    //     <p><a href="list.html">List</a> all users</p>
    //     <p><a href="search.html">Search</a> for a particular user.</p>
    //   </body>
    // </html>`
    const html = doMustache(app, 'index', model);
    res.send(html);
  };
}




/*************************** FIELD Definitions ***************************/

const SEARCH_INFO = {
  q: {
    friendlyName: 'Search Terms',
    isSearch: 'true',
    isRequired: 'true',
    regex: /^\w+$/,
    error: 'Search terms should be valid',
  }
};

const FIELDS_INFO = {
  filename: {
    friendlyName: 'File Name',
    isSearch: 'true',
    isId: 'true',
    isRequired: 'true',
    regex: /^\w+$/,
    error: 'File name field can only contain alphanumerics or _',
  },
  fileContent: {
    friendlyName: 'File Content',
    isSearch: 'true',
     regex: /^[a-zA-Z\-\' ]+$/,
    error: "First Name field can only contain alphabetics, -, ' or space",
  }
};

const FIELDS = Object.keys(FIELDS_INFO).map((n) => Object.assign({ name: n }, FIELDS_INFO[n]));
const SearchFields = Object.keys(SEARCH_INFO).map((field) => Object.assign({ name: field }, SEARCH_INFO[field]));




/************************ General Utilities ****************************/

/** return object containing all non-empty values from object values */
function getNonEmptyValues(values) {
  console.log("inside the getNotEmpty values");

  const out = {};
  Object.keys(values).forEach(function (k) {
    const v = values[k];
    if (v && v.trim().length > 0) out[k] = v.trim();
  });
  console.log("dir");
  console.dir(out);
  return out;
}

function errorModel(app, values = {}, errors = {}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

/** Return a URL relative to req.originalUrl.  Returned URL path
 *  determined by path (which is absolute if starting with /). For
 *  example, specifying path as ../search.html will return a URL which
 *  is a sibling of the current document.  Object queryParams are
 *  encoded into the result's query-string and hash is set up as a
 *  fragment identifier for the result.
 */
function relativeUrl(req, path = '', queryParams = {}, hash = '') {
  const url = new URL('http://dummy.com');
  url.protocol = req.protocol;
  url.hostname = req.hostname;
  url.port = req.socket.address().port;
  url.pathname = req.originalUrl.replace(/(\?.*)?$/, '');
  if (path.startsWith('/')) {
    url.pathname = path;
  }
  else if (path) {
    url.pathname += `/${path}`;
  }
  url.search = '';
  Object.entries(queryParams).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });
  url.hash = hash;
  return url.toString();
}


/************************** Field Utilities *************************/

function fieldsWithValues(values, errors = {}) {
  return SearchFields.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}
/************************** Template Utilities *************************/


/** Return result of mixing view-model view into template templateId
 *  in app templates.
 */
function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return mustache.render(app.templates[templateId], view, templates);
}

/** Add contents all dir/*.ms files to app templates with each
 *  template being keyed by the basename (sans extensions) of
 *  its file basename.
 */
function setupTemplates(app, dir) {
  app.templates = {};
  for (let fname of fs.readdirSync(dir)) {
    console.log("field name -> " + fname);
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
        //String(fs.readFileSync(`${TEMPLATES_DIR}/create.ms`));
        //console.log("app.templates[m[1]] -> "+app.templates[m[1]]);
        String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

