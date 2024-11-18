const attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];

function filterAttendanceByDate(rangeType) {
  const now = new Date();
  return attendanceData.filter(entry => {
    const entryDate = new Date(entry.date.split("/").reverse().join("-"));
    switch (rangeType) {
      case 'daily':
        return entryDate.toDateString() === now.toDateString();
      case 'weekly':
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return entryDate >= oneWeekAgo;
      case 'monthly':
        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      case 'yearly':
        return entryDate.getFullYear() === now.getFullYear();
      default:
        return false;
    }
  });
}

function generateReport(rangeType) {
  const filteredData = filterAttendanceByDate(rangeType);
  const presentCount = filteredData.filter(entry => entry.attendance === 'حاضر').length;
  const absentCount = filteredData.filter(entry => entry.attendance === 'غائب').length;

  const reportContent = document.getElementById("reportContent");
  reportContent.innerHTML = `
    <h3>تقرير ${getRangeTypeName(rangeType)}</h3>
    <p>عدد الحاضرين: ${presentCount}</p>
    <p>عدد الغائبين: ${absentCount}</p>
    <table>
      <thead>
        <tr>
          <th>اسم الموظف</th>
          <th>رقم الأداء</th>
          <th>الحضور</th>
          <th>التاريخ</th>
        </tr>
      </thead>
      <tbody>
        ${filteredData.map(entry => `
          <tr>
            <td>${entry.name}</td>
            <td>${getPerformanceScore(entry.name)}</td>
            <td>${entry.attendance}</td>
            <td>${entry.date}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function getPerformanceScore(employeeName) {
  const employeeData = JSON.parse(localStorage.getItem("employees")) || [];
  const employee = employeeData.find(emp => emp.name === employeeName);
  return employee ? employee.performance : "غير متوفر";
}

function getRangeTypeName(rangeType) {
  switch (rangeType) {
    case 'daily': return "اليومي";
    case 'weekly': return "الأسبوعي";
    case 'monthly': return "الشهري";
    case 'yearly': return "السنوي";
    default: return "";
  }
}
