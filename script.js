// ===== 1. كلاس الطالب =====
class Student {
  constructor(id, name, grades, attendance) {
    this.id = id;
    this.name = name;
    this.grades = grades;         // مصفوفة درجات 3 مواد
    this.attendance = attendance; // نسبة الحضور
  }

  // ===== 2. دوال التحليل الأكاديمي =====

  // حساب المتوسط باستخدام reduce
  calculateAverage() {
    const total = this.grades.reduce((sum, grade) => sum + grade, 0);
    return total / this.grades.length;
  }

  // التقدير بالحروف (يستقبل المتوسط)
  getGrade(average) {
    if (average >= 90) return "A";
    else if (average >= 80) return "B";
    else if (average >= 70) return "C";
    else if (average >= 60) return "D";
    else if (average >= 50) return "E";
    else return "F";
  }

  // النتيجة النهائية: متوسط >= 50 && حضور >= 75
  getFinalResult() {
    const average = this.calculateAverage();
    if (average >= 50 && this.attendance >= 75) {
      return "ناجح";
    }
    return "يحتاج مراجعة";
  }
}

// ===== 3. نظام تشغيل الجامعة =====
const studentsList = [
  new Student(101, "أحمد علي", [90, 85, 95], 95),   // متوسط 90
  new Student(102, "سارة محمود", [45, 48, 42], 85), // متوسط 45 (متعثرة)
  new Student(103, "عمر خالد", [50, 44, 47], 80),   // متوسط 47 (متعثر)
  new Student(104, "منى حسن", [70, 65, 80], 60),    // متوسط 71.67 وحضور ضعيف
];

// ===== 5-أ. تقرير كل طالب =====
console.log("========== تقرير الطلاب ==========");
studentsList.forEach((student) => {
  const average = student.calculateAverage();
  console.log(
    `الاسم: ${student.name} | المتوسط: ${average.toFixed(2)} | التقدير: ${student.getGrade(average)} | النتيجة: ${student.getFinalResult()}`
  );
});

// ===== 4. لجنة الرأفة =====

// الاستخراج: المتعثرون (متوسط بين 40 و 49)
const strugglingStudents = studentsList.filter((student) => {
  const average = student.calculateAverage();
  return average >= 40 && average <= 49;
});

// المعالجة: إضافة 5 درجات رأفة (بدون تعديل الكائنات الأصلية)
const mercyStudents = strugglingStudents.map((student) => {
  const originalAverage = student.calculateAverage();
  return {
    id: student.id,
    name: student.name,
    originalAverage: originalAverage,
    newAverage: originalAverage + 5,
  };
});

// التحليل: جمع المتوسطات الجديدة باستخدام reduce
const totalNewAverages = mercyStudents.reduce(
  (sum, student) => sum + student.newAverage,
  0
);

// متوسط الرأفة مع درع الحماية من القسمة على صفر
let mercyAverage = 0;
if (mercyStudents.length > 0) {
  mercyAverage = totalNewAverages / mercyStudents.length;
}

// ===== 5-ب و 5-ج. باقي المخرجات =====
console.log("========== الطلاب المتعثرون بعد الرأفة ==========");
console.log(mercyStudents);

console.log("========== متوسط المتعثرين بعد التعديل ==========");
console.log(mercyAverage.toFixed(2));
