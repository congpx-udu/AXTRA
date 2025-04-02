var students = JSON.parse(localStorage.getItem("students")) || [];

function laySV() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function addStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var id = document.getElementById("iD").value || Date.now().toString();
  var fullName = document.getElementById("fullName").value.trim();
  var age = parseInt(document.getElementById("age").value);
  var gpa = parseFloat(document.getElementById("gpa").value);
  var hometown = document.getElementById("hometown").value.trim();
  var students = laySV(); // Đã sửa từ getStudents()
  var findId = students.findIndex((s) => s.id == id);

  var gender = "";
  if (document.getElementById("male").checked) {
    gender = "Nam";
  } else if (document.getElementById("female").checked) {
    gender = "Nữ";
  }

  if (!fullName || isNaN(age) || isNaN(gpa) || !hometown || !gender) {
    alert("Vui lòng điền đầy đủ thông tin hợp lệ!");
    return;
  }

  const student = {
    id,
    fullName,
    age,
    gender,
    gpa: parseFloat(gpa.toFixed(2)),
    hometown,
  };

  if (findId >= 0) {
    students[findId] = student;
  } else {
    students.push(student);
  }

  addStudents(students);
  getStudents();
  this.reset();
  document.getElementById("iD").value = "";
});

function getStudents(students = laySV()) {
  var studentList = document.getElementById("studentList");
  studentList.innerHTML = "";
  var headerRow = document.createElement("tr");
  headerRow.innerHTML = `
    <th>STT</th>
    <th>Họ và tên</th>
    <th>Mã sinh viên</th>
    <th>Tuổi</th>
    <th>Giới tính</th>
    <th>GPA</th>
    <th>Quê quán</th>
    <th>Thao tác</th>
  `;
  studentList.appendChild(headerRow);

  if (students.length === 0) {
    var row = document.createElement("tr");
    row.innerHTML = `<td colspan="8">Không có sinh viên nào</td>`;
    studentList.appendChild(row);
    return;
  }

  students.forEach((student, index) => {
    var row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.fullName}</td>
      <td>${student.id}</td>
      <td>${student.age}</td>
      <td>${student.gender}</td>
      <td>${student.gpa.toFixed(2)}</td>
      <td>${student.hometown}</td>
      <td>
        <button onclick="editStudent('${student.id}')">Sửa</button>
        <button onclick="deleteStudent('${student.id}')">Xóa</button>
      </td>
    `;
    studentList.appendChild(row);
  });
}

function editStudent(id) {
  var students = laySV();
  var student = students.find((s) => s.id == id);

  if (student) {
    document.getElementById("iD").value = student.id;
    document.getElementById("fullName").value = student.fullName;
    document.getElementById("age").value = student.age;
    document.getElementById("gpa").value = student.gpa;
    document.getElementById("hometown").value = student.hometown;
    document.getElementById("male").checked = student.gender === "Nam";
    document.getElementById("female").checked = student.gender === "Nữ";
    document.getElementById("studentForm").scrollIntoView();
  }
}

function deleteStudent(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
    var students = laySV().filter((s) => s.id != id);
    addStudents(students);
    getStudents();
  }
}

document
  .getElementById("loc-thongtinsv")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    filterStudents();
  });

function filterStudents() {
  var gender = document.getElementById("filterGender").value;
  var hometown = document.getElementById("filterHometown").value.trim();
  var minGPA = parseFloat(document.getElementById("filterGPA").value) || 0;
  var filtered = laySV().filter((s) => {
    return (
      (gender === "Tất cả" || s.gender === gender) &&
      (hometown === "" || s.hometown.includes(hometown)) &&
      s.gpa >= minGPA
    );
  });

  getStudents(filtered);
}

document.getElementById("sort-sv").addEventListener("submit", function (e) {
  e.preventDefault();

  var criteria = document.getElementById("tieuchi").value;
  var order = document.getElementById("thutu").value;

  sortStudents(criteria, order);
});

function sortStudents(criteria, order) {
  let students = laySV();

  students.sort((a, b) => {
    let compareA = a[criteria];
    let compareB = b[criteria];

    if (criteria === "fullName") {
      const lastNameA = compareA.split(" ").pop().toLowerCase();
      const lastNameB = compareB.split(" ").pop().toLowerCase();
      compareA = lastNameA;
      compareB = lastNameB;
    }

    if (typeof compareA === "string") {
      return compareA.localeCompare(compareB);
    } else {
      return compareA - compareB;
    }
  });

  if (order === "desc") {
    students.reverse();
  }

  addStudents(students);
  getStudents();
}

document.addEventListener("DOMContentLoaded", function () {
  getStudents();
});
