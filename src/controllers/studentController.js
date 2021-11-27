const mongoose = require("mongoose");
const Student = mongoose.model("Student");
const axios = require("axios");
const moment = require("moment");

// Global variables
const recordsAPI = "http://localhost:5001";

exports.register = async (req, res) => {
     const body = req.body;
     const isValid = body.numStudent && body.name && body.card && body.card.number && body.card.validaty;

     if (!isValid) {
          return res.status(400).json({ message: "All fields are required!" });
     }

     let student = await Student.findOne({
          number: body.numStudent,
     });

     if (!student) {
          student = new Student();
     }

     student.number = body.numStudent;
     student.card = {
          number: body.card.number,
          validaty: body.card.validaty,
     };
     student.name = body.name;

     // guardar
     student.save((err) => {
          if (err) {
               return res.status(404).json(err);
          } else {
               return res.status(200).json({ message: "Student register successfuly" });
          }
     });
};

exports.getAll = (req, res) => {
     Student.find({}, (err, students) => {
          if (err) {
               return res.status(404).json(err);
          } else {
               return res.status(200).json(students);
          }
     });
};

exports.getOne = async (req, res) => {
     var id = req.params.id;

     if (!id) return req.status(400).json({ message: "Must specify a studentId" });

     Student.findOne({ number: id }, (err, student) => {
          if (err) return res.status(400).json({ message: err });
          else {
               if (!student) return res.status(404).json({ message: "Student not found!" });
               else return res.status(200).json(student);
          }
     });
};

exports.getPresencesByStudent = async (req, res) => {
     let id = req.params.id;

     if (!id) return res.status(400).json({ message: "Must specify a student id" });

     try {
          let student = await Student.findOne({ number: id });

          if (!student) return res.status(400).json({ message: "The student id specified doesn't exist" });

          // get all records from another api
          let presences = await axios.get(`${recordsAPI}/records/all`);

          if (!presences.data) return res.status(404).json({ message: "No presences registered." });

          return res.status(200).json(
               presences.data.filter((obj) => {
                    return obj.cardNumber == student.card.number && moment(obj.lastPresence) >= moment().startOf("day") && moment(obj.lastPresence) <= moment().endOf("day");
               })
          );
     } catch (err) {
          console.log(err);
          return res.status(404).json({ message: err });
     }
};

exports.getPresencesByDay = async (req, res) => {
     let day = req.query.day;
     if (!day) return res.status(400).json({ message: "Must specify a date." });
     try {
          let presences = await axios.get(`${recordsAPI}/records/all`);

          if (!presences.data) return res.status(404).json({ message: "No presences registered." });

          return res.status(200).json(
               presences.data.filter((obj) => {
                    return moment(obj.lastPresence) >= moment(day).startOf("day") && moment(obj.lastPresence) <= moment(day).endOf("day");
               })
          );
     } catch (err) {}
};

exports.getPresencesByStudentAndInterval = async (req, res) => {
     let from = req.query.from;
     let to = req.query.to;
     let id = req.params.id;

     let isValid = from && to && id;

     if (!isValid) return res.status(400).json({ message: "Must specify the student id and date interval." });

     try {
          let student = await Student.findOne({ number: id });

          if (!student) return res.status(404).json({ message: "The student id specified doesn't exist" });

          let presences = await axios.get(`${recordsAPI}/records/all`);
          if (!presences.data) return res.status(400).json({ message: "No presences registered." });

          return res.status(200).json(
               presences.data.filter((obj) => {
                    return moment(obj.lastPresence) >= moment(from).startOf("day") && moment(obj.lastPresence) <= moment(to).endOf("day") && obj.cardNumber == student.card.number;
               })
          );
     } catch (err) {
          console.log(err);
          return res.status(404).json(err);
     }
};
