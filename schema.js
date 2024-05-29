const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    emailid: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  });
  

  const User = mongoose.model('Userdetails',userSchema)

  module.exports={User}