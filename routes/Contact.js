// CRUD APIs
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// /api/contact/
router.post("/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact
      .save()
      .then((savedContact) => {
        console.log(savedContact);
        res.status(201).json({ msg: "Contact successfully saved" });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 11000) {
          res.status(500).json({ msg: "Email Address already in use." });
        } else {
          res.status(500).json({ msg: "Unable to create new Contact" });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to save new contact" });
  }
});

router.get("/contact", async (req, res) => {
  try {
    Contact.find()
      .then((contacts) => {
        console.log(contacts);
        res.status(200).json({ contacts: contacts });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ msg: "Unable to get contacts." });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to get contacts." });
  }
});

router.get("/contact/:id", async (req, res) => {
  try {
    const id = req.params.id;
    Contact.findById(id)
      .then((contact) => {
        console.log(contact);
        res.status(200).json({ contact: contact });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ msg: "Unable to find the contact." });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to find the contact." });
  }
});

router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const searchRegex = new RegExp(searchTerm, "i");
    Contact.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { emailAddress: searchRegex },
      ],
    })
      .then((contacts) => {
        console.log(contacts);
        if (contacts.length) res.status(200).json({ contacts: contacts });
        else
          res
            .status(200)
            .json({ contacts: [], msg: "No matching records found." });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ msg: "Unable to find contacts." });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "No matching record found." });
  }
});

router.put("/contact/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedContact = req.body;
    Contact.findOneAndUpdate({ _id: id }, updatedContact, { new: true })
      .then((updatedContact) => {
        console.log(updatedContact);
        res.status(200).json({
          msg: "Contact successfully updated.",
          contact: updatedContact,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ msg: "Unable to update contact." });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to update the contact." });
  }
});

// soft delete --> active => Y/N
// hard delete
router.delete("/contact/:id", async (req, res) => {
  try {
    const id = req.params.id;
    Contact.findByIdAndDelete(id)
      .then((deletedContact) => {
        console.log(deletedContact);
        res
          .status(200)
          .json({
            msg: "Contact successfully deleted.",
            contact: deletedContact,
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ msg: "Unable to delete the contact." });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to delete contact." });
  }
});

module.exports = router;
