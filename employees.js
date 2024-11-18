const employeeList = document.getElementById("employeeList");
const addEmployeeForm = document.getElementById("addEmployeeForm");
const employeeNameInput = document.getElementById("newEmployeeName");
const performanceInput = document.getElementById("performanceScore");

let employeeData = JSON.parse(localStorage.getItem("employees")) || [];

function saveEmployees() {
  localStorage.setItem("employees", JSON.stringify(employeeData));
}

function renderEmployeeList() {
  employeeList.innerHTML = "";
  employeeData.forEach((employee, index) => {
    const li = document.createElement("li");
    li.textContent = `${employee.name} - رقم الأداء: ${employee.performance}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "مسح";
    deleteButton.onclick = () => {
      employeeData.splice(index, 1);
      saveEmployees();
      renderEmployeeList();
    };
    li.appendChild(deleteButton);
    employeeList.appendChild(li);
  });
}

addEmployeeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newEmployee = {
    name: employeeNameInput.value,
    performance: performanceInput.value
  };
  employeeData.push(newEmployee);
  saveEmployees();
  renderEmployeeList();
  employeeNameInput.value = "";
  performanceInput.value = "";
});

renderEmployeeList();
