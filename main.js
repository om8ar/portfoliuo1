const employeeData = JSON.parse(localStorage.getItem("employees")) || [];
const attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];

// تحديث قائمة الموظفين في النموذج
const employeeSelect = document.getElementById("employeeSelect");
employeeData.forEach(employee => {
  const option = document.createElement("option");
  option.value = employee.name;
  option.textContent = `${employee.name} - رقم الأداء: ${employee.performance}`;
  employeeSelect.appendChild(option);
});

// إضافة أو تعديل الحضور أو الغياب
const attendanceForm = document.getElementById("attendanceForm");
let editingIndex = -1;  // مؤشر لتحديد إذا كنا في وضع التعديل

attendanceForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const employeeName = employeeSelect.value;
  const attendanceStatus = document.getElementById("attendanceStatus").value;
  const task = document.getElementById("requiredTask").value;
  const date = new Date().toLocaleDateString('ar-EG');

  // إذا كنا في وضع التعديل
  if (editingIndex !== -1) {
    // تحديث السجل الموجود في بيانات الحضور
    attendanceData[editingIndex] = {
      name: employeeName,
      attendance: attendanceStatus,
      date: date,
      task: task
    };
    editingIndex = -1;  // إلغاء وضع التعديل
  } else {
    // إضافة بيانات الحضور الجديدة
    const newAttendance = {
      name: employeeName,
      attendance: attendanceStatus,
      date: date,
      task: task
    };
    attendanceData.push(newAttendance);
  }

  // تحديث الذاكرة المحلية
  localStorage.setItem("attendance", JSON.stringify(attendanceData));

  // تحديث الجدول بعد إضافة أو تعديل البيانات
  renderAttendanceTable();
  attendanceForm.reset();  // إعادة تعيين النموذج
});

// عرض جدول الحضور والغياب
function renderAttendanceTable() {
  const tableBody = document.querySelector("#attendanceTable tbody");
  tableBody.innerHTML = "";  // مسح الجدول السابق

  attendanceData.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${getPerformanceScore(entry.name)}</td>
      <td>${entry.task}</td>
      <td>${entry.date}</td>
      <td>
        <button class="editBtn" onclick="editAttendance(${index})">تعديل</button>
        <button class="deleteBtn" onclick="deleteAttendance(${index})">مسح</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// الحصول على رقم الأداء من بيانات الموظفين
function getPerformanceScore(employeeName) {
  const employee = employeeData.find(emp => emp.name === employeeName);
  return employee ? employee.performance : "غير متوفر";
}

// مسح سجل الحضور والغياب
function deleteAttendance(index) {
  attendanceData.splice(index, 1);
  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  renderAttendanceTable();
}

// التعديل على سجل الحضور
function editAttendance(index) {
  const entry = attendanceData[index];
  // ملء النموذج بالبيانات الحالية للسجل
  document.getElementById("employeeSelect").value = entry.name;
  document.getElementById("attendanceStatus").value = entry.attendance;
  document.getElementById("requiredTask").value = entry.task;
  editingIndex = index;  // حفظ فهرس السجل الذي يتم تعديله
}

// عرض البيانات عند تحميل الصفحة
renderAttendanceTable();
