function calculateDowntime() {
  const faultStartInput = document.getElementById("fault-start").value;
  const faultEndInput = document.getElementById("fault-end").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!faultStartInput || !faultEndInput) {
    alert("Please enter both fault start and end times.");
    return;
  }

  const faultStart = new Date(faultStartInput);
  const faultEnd = new Date(faultEndInput);

  if (faultEnd <= faultStart) {
    alert("Fault end time must be after start time.");
    return;
  }

  const allowedMaintenanceHours = 6;  // Allowed maintenance hours in work period
  const workStartHour = 5;            // 5:30 AM start
  const workStartMinute = 30;
  const workDurationHours = 19;       // From 5:30 AM to 12:30 AM next day

  let totalDownTimeMs = 0;
  let currentDate = new Date(faultStart);

  // Get start of work period for a given date
  function getWorkPeriodStart(date) {
    let d = new Date(date);
    d.setHours(workStartHour, workStartMinute, 0, 0);
    return d;
  }

  // Get end of work period for a given date (next day 12:30 AM)
  function getWorkPeriodEnd(date) {
    let d = new Date(date);
    d.setDate(d.getDate() + 1);
    d.setHours(0, 30, 0, 0);
    return d;
  }

  // Format date for display
  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  while (currentDate <= faultEnd) {
    const workPeriodStart = getWorkPeriodStart(currentDate);
    const workPeriodEnd = getWorkPeriodEnd(currentDate);

    // Calculate fault period inside work period
    const periodStart = faultStart > workPeriodStart ? faultStart : workPeriodStart;
    const periodEnd = faultEnd < workPeriodEnd ? faultEnd : workPeriodEnd;

    if (periodEnd > periodStart) {
      const diffMs = periodEnd - periodStart;
      const diffHours = diffMs / (1000 * 60 * 60);

      const dailyDownTime = diffHours > allowedMaintenanceHours ? diffHours - allowedMaintenanceHours : 0;
      totalDownTimeMs += dailyDownTime * 60 * 60 * 1000;

      const hours = Math.floor(dailyDownTime);
      const minutes = Math.round((dailyDownTime - hours) * 60);
      resultsDiv.innerHTML += `<p>📅 ${formatDate(currentDate)}: Down Time = ${hours} hours and ${minutes} minutes</p>`;
    } else {
      resultsDiv.innerHTML += `<p>📅 ${formatDate(currentDate)}: Down Time = 0 hours and 0 minutes</p>`;
    }

    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }

  const totalDownTimeHours = Math.floor(totalDownTimeMs / (1000 * 60 * 60));
  const totalDownTimeMinutes = Math.round((totalDownTimeMs / (1000 * 60)) % 60);

  resultsDiv.innerHTML += `<hr><p><strong>📊 Total Down Time: ${totalDownTimeHours} hours and ${totalDownTimeMinutes} minutes</strong></p>`;
}
