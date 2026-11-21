"use strict";

/* ========== الخطوة 2: كلاس Student (من التكليف الثاني) + الكبسلة ========== */
class Student {
  #id;
  #name;
  #grades;
  #attendance;

  constructor(id, name, grades, attendance) {
    this.id = id;
    this.name = name;
    this.grades = grades;
    this.attendance = attendance;
  }

  static #validate(value, label) {
    if (value === "" || value === null || value === undefined || String(value).trim() === "") {
      throw new Error(`حقل ${label} فارغ، من فضلك أدخل قيمة.`);
    }
    const number = Number(value);
    if (Number.isNaN(number)) {
      throw new Error(`حقل ${label} يجب أن يكون رقماً.`);
    }
    if (number < 0 || number > 100) {
      throw new Error(`${label} يجب أن تكون بين 0 و 100.`);
    }
    return number;
  }

  get id() { return this.#id; }
  set id(value) { this.#id = value; }

  get name() { return this.#name; }
  set name(value) {
    if (value === null || value === undefined || String(value).trim() === "") {
      throw new Error("اسم الطالب فارغ، من فضلك أدخل الاسم.");
    }
    this.#name = String(value).trim();
  }

  get grades() { return [...this.#grades]; }
  set grades(value) {
    const labels = ["درجة المادة الأولى", "درجة المادة الثانية", "درجة المادة الثالثة"];
    if (!Array.isArray(value) || value.length !== 3) {
      throw new Error("يجب إدخال درجات ثلاث مواد.");
    }
    this.#grades = value.map((grade, i) => Student.#validate(grade, labels[i]));
  }

  get attendance() { return this.#attendance; }
  set attendance(value) {
    this.#attendance = Student.#validate(value, "نسبة الحضور");
  }

  calculateAverage() {
    const total = this.#grades.reduce((sum, grade) => sum + grade, 0);
    return total / this.#grades.length;
  }

  getGrade(average) {
    if (average >= 90) return "A";
    else if (average >= 80) return "B";
    else if (average >= 70) return "C";
    else if (average >= 60) return "D";
    else if (average >= 50) return "E";
    else return "F";
  }

  getFinalResult() {
    const average = this.calculateAverage();
    if (average >= 50 && this.#attendance >= 75) {
      return "ناجح";
    }
    return "يحتاج مراجعة";
  }
}

/* ========== الخطوة 3: التفاعل مع الشاشة ========== */
const studentsList = [];
let nextId = 101;

const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");
const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");
const errorBox = document.getElementById("errorBox");
const studentsBox = document.getElementById("studentsBox");
const reportBox = document.getElementById("reportBox");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderStudents() {
  studentsBox.innerHTML = studentsList
    .map((s) => {
      const average = s.calculateAverage();
      return `
        <div class="student-row">
          <span class="fw-semibold">${escapeHtml(s.name)}</span>
          <span class="text-muted">المتوسط: ${average.toFixed(2)} | ${s.getGrade(average)} | ${s.getFinalResult()}</span>
        </div>`;
    })
    .join("");
}

addBtn.onclick = function () {
  errorBox.textContent = "";

  try {
    const student = new Student(
      nextId,
      nameInput.value,
      [grade1Input.value, grade2Input.value, grade3Input.value],
      attendanceInput.value
    );

    studentsList.push(student);
    nextId++;
    renderStudents();

    nameInput.value = "";
    grade1Input.value = "";
    grade2Input.value = "";
    grade3Input.value = "";
    attendanceInput.value = "";
    nameInput.focus();
  } catch (error) {
    errorBox.textContent = error.message;
  }
};

/* ========== الخطوة 4: لجنة الرأفة ========== */
mercyBtn.onclick = function () {
  errorBox.textContent = "";

  const strugglingStudents = studentsList.filter((student) => {
    const average = student.calculateAverage();
    return average >= 40 && average <= 49;
  });

  const mercyStudents = strugglingStudents.map((student) => {
    const originalAverage = student.calculateAverage();
    return {
      id: student.id,
      name: student.name,
      originalAverage: originalAverage,
      newAverage: originalAverage + 5,
    };
  });

  const totalNewAverages = mercyStudents.reduce((sum, s) => sum + s.newAverage, 0);

  let mercyAverage = 0;
  if (mercyStudents.length > 0) {
    mercyAverage = totalNewAverages / mercyStudents.length;
  }

  if (mercyStudents.length === 0) {
    reportBox.innerHTML = `
      <div class="alert alert-info mb-0">لا يوجد طلاب متعثرون (متوسطهم بين 40 و 49).</div>`;
    return;
  }

  reportBox.innerHTML = `
    <p class="mb-1">عدد الطلاب المتعثرين</p>
    <p class="report-figure">${mercyStudents.length}</p>

    <p class="mb-1">الأسماء ومتوسطاتهم بعد الرأفة</p>
    <ul class="list-unstyled mb-3">
      ${mercyStudents
        .map((s) => `<li class="student-row"><span>${escapeHtml(s.name)}</span><span>${s.newAverage.toFixed(2)}</span></li>`)
        .join("")}
    </ul>

    <p class="mb-1">المتوسط العام بعد الرأفة</p>
    <p class="report-figure mb-0">${mercyAverage.toFixed(2)}</p>`;
};
