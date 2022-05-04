const express = require('express');

const app = express();
app.use(express.json());

let employees = []

app.get('/get', (req, res) => {
    res.status(200).json({
        data: employees
    })
})

app.post('/new', (req, res) => {
    if (
        !req.body.firstname ||
        !req.body.lastname  ||
        !req.body.id        ||
        !req.body.position  ||
        !req.body.tel       ||
        !req.body.email
    ) {
        return res.status(400).json({ message: "Error" })
    }

    for (let i = 0; i < employees.length; i++) {
        if (
            employees[i].id == req.body.id      ||
            employees[i].tel == req.body.tel    ||
            employees[i].email == req.body.email
        ) {
            return res.status(400).json({ message: "Error: มีข้อมูลซ้ำ" })
        }
    }

    const newData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        id: req.body.id,
        position : req.body.position ,
        tel: req.body.tel,
        email: req.body.email
    };

    employees.push(newData)

    res.status(200).json({ message: "Success" })
})
app.put('/edit', (req, res) => {
    if (
        !req.body.id ||
        (
            !req.body.position  &&
            !req.body.tel       &&
            !req.body.email
        )
    ) {
        return res.status(400).json({ message: "Error" })
    }

    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id == req.body.id) {

            if (req.body.position ) employees[i].position = req.body.position 
            if (req.body.tel) employees[i].tel = req.body.tel
            if (req.body.email) employees[i].email = req.body.email

            return res.status(200).json({ message: "Success" })
        }
    }

    return res.status(400).json({ message: "Error: ไม่สามารถแก้ไขได้เนื่องจากไม่ตรงเงื่อนไข" })
})

app.delete('/delete', (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ message: "Error" })
    }
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id == req.body.id) {
            employees.splice(i, 1);
            return res.status(200).json({ message: "Success" })
        }
    }
    return res.status(400).json({ message: "Error: ไม่สามารถลบได้เนื่องจากไม่ตรงเงื่อนไข" })
})

app.listen(3000, () => {
    console.log('ขณะนี้อยู่ที่ port: 3000');
});