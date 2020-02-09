'use strict';

const axios = require('axios');


function DocsWs(baseUrl) {
  this.docsUrl = `${baseUrl}/docs`;
  console.log("Inside DocsWs "+this.docsUrl);
}

module.exports = DocsWs;


//list All - Search if you send q.
DocsWs.prototype.list = async function(q) {
  try {
    const url = this.docsUrl + ((q === undefined) ? '' : `?${q}`);
    const response = await axios.get(url);
    return response.data;
  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

//get
DocsWs.prototype.getContent = async function(id) {
  try {
    const response = await axios.get(`${this.docsUrl}/${id}`);
    return response.data;
  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }  
};

//create
DocsWs.prototype.addContent = async function(document) {
  try {
    console.log("Inside the the create of Docsws");

    const response = await axios.post(this.docsUrl, document);
    return response;
  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};




//@TODO add wrappers to call remote web services.
  
