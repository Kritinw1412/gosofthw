const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req.query)

    if (!req.query.n1) return res.status(403).send("error");
    if (!req.query.n2) return res.status(403).send("error");
    if (!req.query.n3) return res.status(403).send("error");
    if (!req.query.n4) return res.status(403).send("error");

    const num19 = /^[1-9]{1,1}$/;
    if (!num19.exec(req.query.n1)) return res.status(403).send("err regex");
    if (!num19.exec(req.query.n2)) return res.status(403).send("err regex");
    if (!num19.exec(req.query.n3)) return res.status(403).send("err regex");
    if (!num19.exec(req.query.n4)) return res.status(403).send("err regex");

    const n1 = parseInt(req.query.n1); 
    const n2 = parseInt(req.query.n2); 
    const n3 = parseInt(req.query.n3); 
    const n4 = parseInt(req.query.n4); 

    const game24solver = require('24game-solver/dist/24game-solver');
    const result = game24solver([n1, n2, n3, n4], 24);
    let sucess = "Success";
    if (result.length == 0) sucess = "Fail"
    console.log(result);

    res.send({
        status: sucess,
        result: result
    })
})

app.listen(3000, () => {
    console.log('ขณะนี้อยู่ที่ port : 3000');
});