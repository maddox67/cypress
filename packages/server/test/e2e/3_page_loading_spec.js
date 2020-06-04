/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const bodyParser = require("body-parser");
const e2e        = require("../support/helpers/e2e").default;

let count = 0;

const onServer = function(app) {
  app.use(bodyParser.json());

  app.get("/first", function(req, res) {
    //# reset the count anytime we visit first again
    count = 0;
    return res.send("<html><h1>first</h1><a href='/second'>second</a></html>");
  });

  app.get("/second", function(req, res) {
    count += 1;
    return res.send(`<html><h1>second</h1><a href='/slow'>slow</a><span id='count'>${count}</span></html>`);
  });

  app.get("/slow", (req, res) => setTimeout(() => res.send("<html><h1>slow</h1></html>")
  , 2000));

  app.get("/form", (req, res) => res.send(`\
<html>
<iframe src="http://localhost:17170/index.html"></iframe>
<form action="/redirected-to"></form>
</html>\
`));

  app.get("/redirected-to", (req, res) => res.send(`\
<html>
<h1>I AM THE NEW PAGE</h1>
<script src="http://localhost:17170/static/jquery.js"></script>
<script>
  $.get('/cypress.json')
  $.get('/cypress.json')
  $.get('/cypress.json')
  $.get('/cypress.json')
</script>
</html>\
`));

  app.post("/json", (req, res) => res.json({
    body: req.body
  }));

  return app.get("/html", (req, res) => res.send("<html>content</html>"));
};

describe("e2e page_loading", function() {
  e2e.setup({
    servers: [{
      port: 1717,
      onServer
    }, {
      port: 17170,
      static: true
    }]
  });

  //# this tests that __cypress.initial is set correctly whilst navigating
  //# between pages, or during cy.reload
  //# additionally this creates an edge case where after __cypress.initial is
  //# set we send an XHR which should not inject because its requested for JSON
  //# but that another XHR which is requested for html should inject
  return e2e.it("passes", {
    spec: "page_loading_spec.coffee",
    snapshot: true
  });
});