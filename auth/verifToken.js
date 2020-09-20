const jwt = require('jsonwebtoken'); 
const config = require('../config/configuration') ; 
const verifToken = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'Vous etes pas connecter' });
      
    jwt.verify(token,config.SECRET, (err, decoded)=> {
      if (err)
      return res.status(500).send({ auth: false, message: 'Token expiré .' });
        
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
    
}

module.exports = verifToken ; 