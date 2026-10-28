/**
 * API configuration.
 * Values come from the Coalition Technologies Postman docs (Authorization section).
 * The Basic Auth header is built at runtime in api.js with btoa() —
 * the pre-encoded key is intentionally NOT hard-coded.
 */
window.APP_CONFIG = {
  API_URL: 'https://fedskillstest.coalitiontechnologies.workers.dev',
  USERNAME: 'coalition',
  PASSWORD: 'skills-test',
  PATIENT_NAME: 'Jessica Taylor'
};
