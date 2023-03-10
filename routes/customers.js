const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Customer, validateCustomer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express("Router");

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.post("/", validate(validateCustomer),async (req, res) => {

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });

    await customer.save();

    res.send(customer);
});

router.put("/:id", validate(validateCustomer),async (req, res) => {
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
        new: true,
    });

    if (!customer)
        return res
            .status(404)
            .send(`Customer with given ID ${req.params.id} not found`);

    res.send(customer);
});

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer)
        return res
            .status(404)
            .send(`Customer with given ID ${req.params.id} not found`);

    res.send(customer);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
        return res
            .status(404)
            .send(`Customer with given ID ${req.params.id} not found`);

    res.send(customer);
});

module.exports = router;
