
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Initial student records
let students = [
    {
        id: 201,
        rollNumber: "CSE2401",
        name: "Aarav Sharma",
        branch: "CSE",
        semester: 3,
        email: "aarav@example.com"
    },
    {
        id: 202,
        rollNumber: "ECE2402",
        name: "Diya Verma",
        branch: "ECE",
        semester: 3,
        email: "diya@example.com"
    },
    {
        id: 203,
        rollNumber: "CSE2403",
        name: "Kabir Singh",
        branch: "CSE",
        semester: 3,
        email: "kabir@example.com"
    }
];

// Generate unique numeric ID
let nextId = 204;

// Validate student data
function validateStudent(data) {
    return (
        data &&
        typeof data.rollNumber === "string" &&
        data.rollNumber.trim() !== "" &&
        typeof data.name === "string" &&
        data.name.trim() !== "" &&
        typeof data.branch === "string" &&
        data.branch.trim() !== "" &&
        Number.isInteger(data.semester) &&
        data.semester > 0 &&
        typeof data.email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    );
}
app.get("/api/students", (req, res) => {
    res.status(200).json(students);
});
app.post("/api/students", (req, res) => {

    const { rollNumber, name, branch, semester, email } = req.body;

    if (!validateStudent(req.body)) {
        return res.status(400).json({
            message: "Invalid input. All fields are required."
        });
    }

    const newStudent = {
        id: nextId++,
        rollNumber,
        name,
        branch,
        semester,
        email
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});
app.get("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});
app.put("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    if (!validateStudent(req.body)) {
        return res.status(400).json({
            message: "Invalid input. All fields are required."
        });
    }

    students[index] = {
        id: id,
        ...req.body
    };

    res.status(200).json({
        message: "Student updated successfully",
        student: students[index]
    });
});
app.delete("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});
app.get("/api/students/filter", (req, res) => {

    const branch = req.query.branch;

    if (typeof branch !== "string" || branch.trim() === "") {
        return res.status(400).json({
            message: "Please provide a branch value"
        });
    }

    const filteredStudents = students.filter(
        s => s.branch.toLowerCase() === branch.trim().toLowerCase()
    );

    res.status(200).json(filteredStudents);
});
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
