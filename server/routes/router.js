const express = require("express")
const router = new express.Router()
const Products = require("../models/productsSchema")
const USER = require("../models/userSchema")

// get products data api
router.get("/getproducts", async(req,res)=>{
    try{
        const productsdata = await Products.find()
        // console.log("console the data "+productsdata)
        res.status(201).json(productsdata)
    }catch(error){
        console.log("error"+ error.message)
    }
    
})

router.get("/getproductsone/:id",async(req,res)=>{
    try{
        const {id} = req.params
        // console.log(id)

        const individualdata = await Products.findOne({id:id})
        // console.log(individualdata+"individual data")

        res.status(201).json(individualdata)

    }catch(error){
        res.status(400).json(individualdata)
        console.log("error"+ error.message)

    }
})

//register data
router.post("/register", async(req,res)=>{
    console.log(req.body)

    const {fname,email,mobile,password,cpassword} = req.body

    if(!fname || !email|| !mobile || !password || !cpassword){
        res.status(422).json({error:"fill the all data"})
        console.log("not data available")
    }

    try{
        const preuser = await USER.findOne({email:email})

        if(preuser){
            res.status(422).json({error:"this user is already exist"})
        }
        else if(password !== cpassword){
            res.status(422).json({error:"password and cpassword don't match each other"})
        }
        else{
            const finalUser = new USER({
                fname,email,mobile,password,cpassword
            })

            const storedata = await finalUser.save()
            console.log(storedata)

            res.status(201).json(storedata)
        }


    }catch(error){
        console.log("error is" + error.message);
        res.status(422).send(error);
    }
});






// login data
router.post("/login", async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }

    try {

        const userlogin = await User.findOne({ email: email });
        console.log(userlogin);
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            console.log(isMatch);

            if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            } else {
                
                const token = await userlogin.generatAuthtoken();
                console.log(token);

                res.cookie("eccomerce", token,{
                    expires: new Date(Date.now() + 2589000),
                    httpOnly: true
                });
                res.status(201).json(userlogin);
            }

        } else {
            res.status(400).json({ error: "user not exist" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid crediential pass" });
        console.log("error is" + error.message);
    }
});




module.exports = router
