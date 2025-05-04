const user = require('../models/accountschema');


// const authRoute = async (req, res, next) => {
//     try{

//         console.log("Custom authentication  middleware");
//         const user_name = req.cookies.username;
//         console.log(user_name);
//         if(!user_name){
//             return res.status(401).json({message: "Login First"});
//         }

//         const user_db= await user.findOne({username: user_name});
//         if(!user_db){
//             return res.status(401).json({message: "User Not Found"});
//         }

//         req.user = user_db;
//         next();
//     }

//     catch(error){
//         return res.status(500).json({message: "Server Error"});
//     }
// }

const authRoute = async (req, res, next) => {
    try {
      console.log("Custom authentication middleware");
  
      const user_name = req.headers['x-username']; // custom header
      console.log(user_name);
  
      if (!user_name) {
        return res.status(401).json({ message: "Login First" });
      }
  
      const user_db = await user.findOne({ username: user_name });
      if (!user_db) {
        return res.status(401).json({ message: "User Not Found" });
      }
  
      req.user = user_db;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  };
  

  const adminRoute = async (req, res, next) => {
    try {
      console.log("Custom Admin Route Middleware");
  
      const user_name = req.headers['x-username']; // Use custom header
  
      if (!user_name) {
        return res.status(401).json({ message: "Login First" });
      }
  
      const user_db = await user.findOne({ username: user_name });
      if (!user_db) {
        return res.status(401).json({ message: "User Not Found" });
      }
  
      // Optional: Check if user is admin
      if (user_db.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admins Only" });
      }
  
      req.user = user_db;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  };
  

module.exports = {authRoute, adminRoute};