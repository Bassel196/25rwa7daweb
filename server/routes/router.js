const express = require("express")
const router = new express.Router()
const Products = require("../models/productsSchema")
const User = require("../models/userSchema")
const authenicate = require("../middleware/authenticate");

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
        const preuser = await User.findOne({email:email})

        if(preuser){
            res.status(422).json({error:"this user is already exist"})
        }
        else if(password !== cpassword){
            res.status(422).json({error:"password and cpassword don't match each other"})
        }
        else{
            const finalUser = new User({
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




// adding the data into cart
router.post("/addcart/:id", authenicate, async (req, res) => {

    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");

        const Usercontact = await User.findOne({ _id: req.userID });
        console.log(Usercontact + "user value");


        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            console.log(cartData + " saved");
            console.log(Usercontact + "user save");
            res.status(201).json(Usercontact);
        }
        else{
            res.status(401).json({error:"Invalid user"});
        }
    } catch (error) {
        console.log(error);
    }
});




// cart details
router.get("/cartdetails", authenicate, async (req, res) => {
    try {
        const buyuser = await User.findOne({ _id: req.userID });
        console.log(buyuser);
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }
});





// get user is login or not
router.get("/validuser", authenicate, async (req, res) => {
    try {
        const validuserone = await User.findOne({ _id: req.userID });
        console.log(validuserone + "user hain home k header main pr");
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});



// remove item from the cart
router.delete("/remove/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item removed");

    } catch (error) {
        console.log(error + " provide then remove");
        res.status(400).json(error);
    }
});





// for userlogout
router.get("/logout", authenicate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("eccomerce", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + " error for user logout");
    }
});

module.exports = router
