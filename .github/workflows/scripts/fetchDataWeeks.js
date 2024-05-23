(async () => {
  const fetch = await import('node-fetch').then(module => module.default);

  const res = await fetch(`${process.env.WEBSITE_URL}/api/workflow/workflowWeeks`, {
    method: 'GET'
  });
  const data = await res.json();
  console.log(data);
})();
