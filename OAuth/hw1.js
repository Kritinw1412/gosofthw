const { response } = require('express');
const express = require('express');
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const jwtsecret = "howdeepisyourlove"

const sqlpool = mysql.createPool({

    namedPlaceholders: true,
    charset: 'utf8',
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "gosoft_hw",

})

const app = express();
app.use(express.json());

app.use((req, response, next) => {
    if (req.path == "/login") return next()

    const authheader = req.headers.authorization

    if (!authheader) return response.json({ msg: "error unauthorize" })

    jwt.verify(authheader.split(' ')[1], jwtsecret, (err, result) => {
        if (err) {
            return response.json({ msg: "error unauthorize" })
        }
        next()
    })
})

//การล็อคอิน
app.post('/login', (req, response) => {
    if (req.body.user == "admin" && req.body.pass == "12345") {
        const token = jwt.sign({ username: "admin" }, jwtsecret)
        return response.json({ token })
    }
    return response.status(400).send("error invalid data");
})


//การดึงข้อมูลพนักงาน
app.get('/getEmployee', (req, response) => {
    const sql = 'select * from employee'
    sqlpool.query(sql, (err, result) => {
        if (err) {
            return response.status(400).json(err)
        }
        return response.json({ data: result })
    })
})


//การเพิ่มข้อมูลพนักงาน
app.post('/createEmployee', (req, response) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.id || !req.body.pos || !req.body.tel || !req.body.email) {
        return response.status(400).send({ message: "error invalid data" })
    }
    const sql = 'insert into employee value (:firstname, :lastname, :id, :pos, :tel, :email)'
    sqlpool.query(sql, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        id: req.body.id,
        pos: req.body.pos,
        tel: req.body.tel,
        email: req.body.email
    }, (err, result) => {
        if (err) {
            return response.status(400).json(err)
        }
        return response.json({ data: "OK Create Succes" })
    })
})

//การแก้ไขข้อมูลพนักงาน
app.put('/updateEmployee', (req, response) => {
    if (
        !req.body.id || !req.body.pos || !req.body.tel || !req.body.email
    ) {
        return response.status(400).send("error invalid data");
    }

    const sql = 'update employee set pos = :pos, tel = :tel, email = :email where id = :id'
    sqlpool.query(sql, {
        id: req.body.id,
        pos: req.body.pos,
        tel: req.body.tel,
        email: req.body.email
    }, (err, result) => {
        if (err) {
            return response.status(400).json(err)
        }
        if (result.affectedRows == 0) return response.status(400).json({ data: "Employee not found" })
        return response.json({ data: "OK Update Succes" })
    })
})

//การลบข้อมูลพนักงาน
app.delete('/delEmployee', (req, response) => {
    if (!req.body.id) {
        return response.status(400).send({ message: "error invalid data" })
    }
    const sql = 'delete from employee where id = :id'
    sqlpool.query(sql, {
        id: req.body.id
    }, (err, result) => {
        if (err) {
            return response.status(400).json(err)
        }
        if (result.affectedRows == 0) return response.status(400).json({ data: "Employee not found" })
        return response.json({ data: "OK Delete Succes" })
    })
})

app.listen(3000, () => {
    console.log('Listening on port: 3000');
});