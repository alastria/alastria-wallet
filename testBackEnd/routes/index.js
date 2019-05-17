var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post("/cbu", function(req, res) {
  console.log(JSON.stringify(req.body))
  res.statusCode = 200;
  res.send({ pruebaOk: "Funciona"});
  //res.end("Ha funcionado " + JSON.stringify({ pruebaOk: "Funciona"}));
  /* res.write("El contenido es el siguiente");
  res.write(JSON.stringify(req.body));
  res.write("Recibido Correctamente"); */
  //res.end();
});

module.exports = router;
