// ==========================================
// الكلاس الاحترافي مع الحقول المخفية وحارس الأمان (Private Fields #)
// ==========================================
class Student {
    #name;
    #grade1;
    #grade2;
    #grade3;
    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {
        this.name = name;
        this.grade1 = grade1;
        this.grade2 = grade2;
        this.grade3 = grade3;
        this.attendance = attendance;
    }

    // Setter لاسم الطالب
    set name(value) {
        if (!value || value.trim() === "") {
            throw new Error("خطأ: يجب كتابة اسم الطالب بشكل صحيح ولا يمكن ترك الحقل فارغاً.");
        }
        this.#name = value.trim();
    }
    get name() { return this.#name; }

    // دالة حماية الدرجات والنسبة
    #validateScore(val, fieldName) {
        if (val === "" || val === null || isNaN(val)) {
            throw new Error(`خطأ: حقل (${fieldName}) فارغ أو يحتوي على قيمة غير صالحة.`);
        }
        let num = Number(val);
        if (num < 0 || num > 100) {
            throw new Error(`خطأ في (${fieldName}): يجب أن تكون القيمة محصورة بين 0 و 100 حصراً.`);
        }
        return num;
    }

    set grade1(val) { this.#grade1 = this.#validateScore(val, "درجة المادة الأولى"); }
    get grade1() { return this.#grade1; }

    set grade2(val) { this.#grade2 = this.#validateScore(val, "درجة المادة الثانية"); }
    get grade2() { return this.#grade2; }

    set grade3(val) { this.#grade3 = this.#validateScore(val, "درجة المادة الثالثة"); }
    get grade3() { return this.#grade3; }

    set attendance(val) { this.#attendance = this.#validateScore(val, "نسبة الحضور"); }
    get attendance() { return this.#attendance; }

    // حساب متوسط الدرجات الثلاث
    calculateAverage() {
        return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
    }
}

// مصفوفة حفظ الطلاب
const studentsList = [];

// جلب العناصر عبر DOM
const nameInput = document.getElementById("studentName");
const sub1Input = document.getElementById("sub1");
const sub2Input = document.getElementById("sub2");
const sub3Input = document.getElementById("sub3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsListBox = document.getElementById("studentsListBox");
const mercyReportBox = document.getElementById("mercyReportBox");

// دالة عرض الأخطاء على الشاشة
function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
}

function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("d-none");
}

// 1. زر إضافة طالب مع شبكة الأمان try/catch
addStudentBtn.addEventListener("click", () => {
    clearError();

    try {
        const student = new Student(
            nameInput.value,
            sub1Input.value,
            sub2Input.value,
            sub3Input.value,
            attendanceInput.value
        );

        studentsList.push(student);
        updateStudentsListUI();

        // تفريغ الحقول بعد الإضافة الناجحة
        nameInput.value = "";
        sub1Input.value = "";
        sub2Input.value = "";
        sub3Input.value = "";
        attendanceInput.value = "";

    } catch (error) {
        showError(error.message);
    }
});

// تحديث قائمة عرض الطلاب في واجهة المستخدم
function updateStudentsListUI() {
    if (studentsList.length === 0) {
        studentsListBox.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fa-solid fa-folder-open fa-2x mb-2 text-info"></i>
                <p class="m-0">لم يتم إضافة طلاب حتى الآن.</p>
            </div>`;
        return;
    }

    let html = `<ul class="list-group list-group-flush">`;
    studentsList.forEach((st, index) => {
        let avg = st.calculateAverage().toFixed(2);
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                    <span class="fw-bold text-dark">${index + 1}. ${st.name}</span>
                    <br><small class="text-muted">نسبة الحضور: ${st.attendance}%</small>
                </div>
                <span class="badge bg-primary rounded-pill px-3 py-2">المتوسط: ${avg}</span>
            </li>`;
    });
    html += `</ul>`;
    studentsListBox.innerHTML = html;
}

// 2. تفعيل لجنة الرأفة (Filter, Map, Reduce)
mercyBtn.addEventListener("click", () => {
    clearError();

    if (studentsList.length === 0) {
        showError("تنبيه: لا يوجد أي طلاب مسجلين في النظام لتطبيق لجنة الرأفة عليهم.");
        return;
    }

    // Filter: استخراج الطلاب الذين تقع متوسطاتهم بين 40 و 49
    const strugglingStudents = studentsList.filter(st => {
        let avg = st.calculateAverage();
        return avg >= 40 && avg < 50;
    });

    if (strugglingStudents.length === 0) {
        mercyReportBox.innerHTML = `
            <div class="alert alert-warning m-0 text-center py-3">
                <i class="fa-solid fa-triangle-exclamation me-1"></i> لا يوجد طلاب متعثرين في النطاق (من 40 إلى 49) لتطبيق الرأفة عليهم.
            </div>`;
        return;
    }

    // Map: إضافة 5 درجات رأفة لمتوسطاتهم
    const updatedAverages = strugglingStudents.map(st => {
        let originalAvg = st.calculateAverage();
        let newAvg = originalAvg + 5;
        return {
            name: st.name,
            oldAvg: originalAvg,
            newAvg: newAvg > 100 ? 100 : newAvg
        };
    });

    // Reduce: حساب المتوسط العام بعد الرأفة للطلاب المتعثرين
    const totalNewAverages = updatedAverages.reduce((sum, item) => sum + item.newAvg, 0);
    const overallMercyAverage = updatedAverages.length > 0 ? (totalNewAverages / updatedAverages.length).toFixed(2) : 0;

    // الطباعة على الشاشة باستخدام Template Literals
    let reportHTML = `
        <div class="row g-2 mb-3">
            <div class="col-sm-6">
                <div class="p-3 bg-light rounded-3 border text-center">
                    <span class="d-block text-muted small">عدد الطلاب المتعثرين</span>
                    <strong class="fs-4 text-primary">${updatedAverages.length}</strong>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="p-3 bg-light rounded-3 border text-center">
                    <span class="d-block text-muted small">المتوسط العام بعد الرأفة</span>
                    <strong class="fs-4 text-success">${overallMercyAverage}</strong>
                </div>
            </div>
        </div>
        <h6 class="fw-bold text-dark mb-2"><i class="fa-solid fa-list-check me-1 text-primary"></i> تفاصيل أسماء الطلاب بعد إضافة 5 درجات رأفة:</h6>
        <ul class="list-group">
    `;

    updatedAverages.forEach(item => {
        reportHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><i class="fa-solid fa-user-graduate text-secondary me-1"></i> ${item.name} <small class="text-muted">(السابق: ${item.oldAvg.toFixed(2)})</small></span>
                <span class="badge bg-success px-3 py-2">بعد الرأفة: ${item.newAvg.toFixed(2)}</span>
            </li>
        `;
    });

    reportHTML += `</ul>`;
    mercyReportBox.innerHTML = reportHTML;
});