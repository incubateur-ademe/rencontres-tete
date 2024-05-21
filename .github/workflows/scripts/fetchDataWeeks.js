const fetch = require('node-fetch');

(async () => {
  const res = await fetch(`${process.env.WEBSITE_URL}/api/workflow/workflowWeeks`, {
    method: 'GET'
  });
  const data = await res.json();
  console.log(data);
})();
