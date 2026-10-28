/** Data layer: talks to the Patient Data API. */
const PatientApi = (() => {
  const { API_URL, USERNAME, PASSWORD, PATIENT_NAME } = window.APP_CONFIG;

  // Build the Basic Auth header ourselves instead of hard-coding the encoded key.
  const authHeader = () => 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`);

  async function fetchPatients() {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { Authorization: authHeader() }
    });
    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }
    return response.json();
  }

  async function fetchTargetPatient() {
    const patients = await fetchPatients();
    const patient = patients.find((p) => p.name === PATIENT_NAME);
    if (!patient) throw new Error(`${PATIENT_NAME} not found in API response`);
    return { patient, patients };
  }

  return { fetchTargetPatient };
})();
