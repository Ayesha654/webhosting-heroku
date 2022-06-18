const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:[true, "Email already exists"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid Email")
            }
        }
    },
    gender:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true,
        min_length : 9
    },
    age:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]

})

//generating token
userSchema.methods.generateAuthToken = async function(){
    try{
        
        console.log(this._id);
        const token = jwt.sign({_id : this._id.toString()}, "generatecharacterslonggggggggggg");
        this.tokens = this.tokens.concat({token});
       await this.save();
        return token;
    }catch(error){
        res.send("the Error Part"+ error);
        console.log("the Error Part"+ error);
    }
}

//converting password into hash
// userSchema.pre("save", async function(next){

//     if(this.isModified("password")){
        
//         this.password = await bcrypt.hash(this.password , 10);
//         this.confirmpassword = await bcrypt.hash(this.password , 10);
//     }

//     next()
// })
//create collection.
const User = new mongoose.model('User',userSchema);

module.exports = User;