# System Data & API Overview

## 1. Data Models

### User

- **Fields:**
  - \_id (ObjectId)
  - email (String, unique)
  - name (String)
  - role (String: 'student', 'admin', 'teacher')
  - googleId (String, optional)
  - profilePicture (String, optional)
  - createdAt, updatedAt
- **Purpose:** Authentication, role management
- **Link:** `User.email` links to `Student.email`

### Student

- **Fields:**
  - \_id (ObjectId)
  - name (String)
  - email (String, unique)
  - studentId (String, e.g., STU-1001)
  - batch (ObjectId, ref: Batch)
  - totalCourseFee (Number)
  - paidAmount (Number)
  - totalDues (Number)
  - status (String: 'Active', ...)
  - enrollmentDate (Date)
  - ...
- **Purpose:** Enrollment, fee tracking, batch assignment

### Batch

- **Fields:**
  - \_id (ObjectId)
  - name (String)
  - classTeacher (String/ObjectId)
  - baseFee (Number)
- **Purpose:** Grouping students, fee structure

### Attendance

- **Fields:**
  - \_id (ObjectId)
  - batch (ObjectId, ref: Batch)
  - date (Date)
  - records: [ { student: ObjectId, status: 'present'|'absent'|'none' } ]
- **Purpose:** Daily attendance per batch

### ResultMatrix

- **Fields:**
  - \_id (ObjectId)
  - batch (ObjectId, ref: Batch)
  - examTitle (String)
  - subject (String)
  - chapter (String)
  - date (Date)
  - maxMarks (Number)
  - scores: [ { student: ObjectId, marksObtained: Number } ]
- **Purpose:** Exam results per batch

### FeePayment

- **Fields:**
  - \_id (ObjectId)
  - student (ObjectId, ref: Student)
  - amountPaid (Number)
  - paymentMode (String: 'Cash', 'UPI', ...)
  - datePaid (Date)
  - remarks (String)
- **Purpose:** Fee installment records

---

## 2. API Endpoints & UI Mapping

### Student Dashboard (UI: StudentDashboard.jsx)

- **GET /students/dashboard/data?studentId=EMAIL**
  - Fetches: Fee summary, attendance, results, batch info for logged-in student
  - Uses: `Student`, `Batch`, `Attendance`, `ResultMatrix`, `FeePayment`

### Fees Page (UI: Fees.jsx)

- **GET /fees/student/:email**
  - Fetches: Fee ledger for student (total, paid, dues, payment history)
  - Uses: `Student`, `FeePayment`
- **GET /fees/pending?batch=ID**
  - Fetches: List of students with pending dues (admin/staff)
  - Uses: `Student`
- **POST /fees/collect**
  - Collects a fee installment for a student
  - Uses: `FeePayment`, updates `Student`

### Attendance Page (UI: Attendance.jsx)

- **GET /attendance/student/:studentId?month=YYYY-MM**
  - Fetches: Attendance records for a student
  - Uses: `Attendance`, `Student`

### Exams/Results Page (UI: Exams.jsx, Results.jsx)

- **GET /exams?batch=ID**
  - Fetches: List of exams for a batch
  - Uses: `ResultMatrix`
- **GET /exams/marks?studentId=EMAIL**
  - Fetches: All marks for a student
  - Uses: `ResultMatrix`, `Student`

---

## 3. Data Flow (UI)

- **Student Login:**
  - Authenticates via Google/JWT, gets `user` object (from `User` collection)
  - Uses `user.email` to fetch student data

- **Fee View (Student):**
  - Calls `/fees/student/:email` → shows summary cards, payment history

- **Fee Collection (Admin):**
  - Calls `/fees/pending` → shows all students with dues
  - Collects fee via `/fees/collect` (opens modal, posts data)

- **Attendance:**
  - Calls `/attendance/student/:studentId` → shows monthly attendance

- **Results:**
  - Calls `/exams/marks?studentId=EMAIL` → shows all marks for student

---

## 4. How Data is Saved & Fetched

- **Saving:**
  - New students: Created via `/students` (admin), also creates `User`
  - Fee payments: Added via `/fees/collect`, creates `FeePayment`, updates `Student.paidAmount`/`totalDues`
  - Attendance: Marked via `/attendance/mark`, updates `Attendance.records`
  - Results: Entered via `/exams/add`, updates `ResultMatrix.scores`

- **Fetching:**
  - Always uses email or ObjectId for lookups
  - Controllers fallback to email if ID not found
  - Data is populated (e.g., batch info in student, student info in payments)

---

## 5. Key Relationships

- `User.email` <-> `Student.email` (login → student data)
- `Student.batch` <-> `Batch._id` (student assigned to batch)
- `Attendance.batch` <-> `Batch._id`, `Attendance.records.student` <-> `Student._id`
- `ResultMatrix.batch` <-> `Batch._id`, `ResultMatrix.scores.student` <-> `Student._id`
- `FeePayment.student` <-> `Student._id`

---

## 6. Example: Fee Data Fetch (Student)

- UI calls: `/fees/student/:email`
- Backend:
  - Finds student by email
  - Finds all `FeePayment` for student
  - Returns: { totalCourseFee, paidAmount, totalDues, paymentHistory: [...] }
- UI shows: Summary cards, payment history table

---

## 7. Example: Fee Collection (Admin)

- UI calls: `/fees/pending` (list), `/fees/collect` (post)
- Backend:
  - Lists all students with dues
  - On collect: Adds `FeePayment`, updates student totals
- UI shows: Table of students, collect modal

---

## 8. Example: Attendance Fetch

- UI calls: `/attendance/student/:studentId?month=YYYY-MM`
- Backend:
  - Finds student by ID/email
  - Finds all attendance records for batch in month
  - Filters for student
- UI shows: Attendance summary, calendar/list

---

## 9. Example: Results Fetch

- UI calls: `/exams/marks?studentId=EMAIL`
- Backend:
  - Finds student by email
  - Finds all exams for batch
  - Filters scores for student
- UI shows: Table of marks

---

## 10. Error Handling

- All endpoints return clear error messages if student/batch not found
- Null checks and logging added for debugging

---

**This file gives you a high-level overview of all data models, API endpoints, and how data flows between backend and frontend.**
