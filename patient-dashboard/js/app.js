/** Entry point: fetch -> render. */
(function () {
  let chart;

  function drawBloodPressureChart(entries) {
    const ctx = document.getElementById('bp-chart');
    const labels = entries.map((e) => `${e.month.slice(0, 3)}, ${e.year}`);
    const dataset = (label, key, color) => ({
      label,
      data: entries.map((e) => e.blood_pressure[key].value),
      borderColor: color,
      backgroundColor: color,
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 7,
      pointHoverRadius: 9,
      borderWidth: 2,
      tension: 0.4
    });

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          dataset('Systolic', 'systolic', '#E66FD2'),
          dataset('Diastolic', 'diastolic', '#8C6FE6')
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: '#072635', font: { size: 12 } } },
          y: {
            min: 60,
            max: 180,
            ticks: { stepSize: 20, color: '#072635', font: { size: 12 } },
            grid: { color: '#CBC8D4' },
            border: { display: false }
          }
        }
      }
    });
  }

  async function init() {
    try {
      const { patient, patients } = await PatientApi.fetchTargetPatient();
      const entries = View.lastMonths(patient.diagnosis_history, 6);
      const latest = entries[entries.length - 1];

      View.renderPatientList(patients, patient.name);
      View.renderProfile(patient);
      View.renderBpLegend(latest);
      View.renderVitals(latest);
      View.renderDiagnostics(patient.diagnostic_list);
      View.renderLabs(patient.lab_results);
      drawBloodPressureChart(entries);
      View.setStatus('');
    } catch (err) {
      console.error(err);
      View.setStatus(`Could not load patient data. ${err.message}`, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
