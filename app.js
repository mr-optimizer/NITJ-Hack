const express =require("express");
const bodyParser=require("body-parser");
const _=require("lodash");
const ejs=require("ejs");
const mongoose=require("mongoose");
const md5=require("md5");


const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/farmBusinessDB",
    { useUnifiedTopology: true ,useNewUrlParser: true,useFindAndModify: false }
);

// schemas
const cropScema=new mongoose.Schema({
    name:String
});
const farmerDetailSchema=new mongoose.Schema({
    fname:String,
    phone:Number,
    adhar:Number,
    password:String,
    address:String,
    village:String,
    state:String,
    pin:Number,
    area:Number,
    crop:[cropScema]
});
const companyDetailSchema=new mongoose.Schema({
    managername:String,
    phone:Number,
    email:String,
    password:String,
    companyname:String,
    city:String,
    state:String,
    pin:Number,
    gstin:String
});

// making modal (collections)
const Crop =new mongoose.model("Crop",cropScema);
const FarmerDetail=new mongoose.model("FarmerDetail",farmerDetailSchema);
const CompanyDetail=new mongoose.model("CompanyDetail",companyDetailSchema);




app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.post("/",function(req,res){
  if(req.body.loginFarmer==="loginFarmer")res.redirect("/loginFarmer");
  if(req.body.registerFarmer==="registerFarmer")res.redirect("/registerFarmer");
  if(req.body.loginCompanies==="loginCompanies")res.redirect("/loginCompanies");
  if(req.body.registerCompanies==="registerCompanies")res.redirect("/registerCompanies");

});


app.get("/loginFarmer",function(req,res){
    res.render("loginFarmer",{message:""});
});
app.post("/loginFarmer",function(req,res){
    const aadhar=req.body.aadhar;
    const password=req.body.password;
     message="User i'd or password not match!!";
    FarmerDetail.findOne({adhar:aadhar,password:password},function(err,foundItem){
        if(err)console.log(err);
        if(!foundItem){
            res.render("loginFarmer",{message:message});
        }else{
            res.render("farmerProfile",{
                name:foundItem.fname,
                phone1:foundItem.phone,
                adhar:foundItem.adhar,
                password:foundItem.password,
                address:foundItem.address,
                village:foundItem.village,
                state:foundItem.state,
                pin:foundItem.pin,
                area:foundItem.area,
                crop:foundItem.crop
            });
        }
    });
});



app.get("/registerFarmer",function(req,res){
    res.render("registerFarmer",{message:""});
});
app.post("/registerFarmer",function(req,res){
    const aadhar1=req.body.aadhar;

    var cropArray=[];
    if(req.body.crop1==="Wheat"){
        const crop1=new Crop({
            name:"Wheat"
        });
        cropArray.push(crop1);
    }
    if(req.body.crop2==="Rice"){
        const crop2=new Crop({
            name:"Rice"
        });
        cropArray.push(crop2);
    }
    if(req.body.crop3==="Pulse"){
        const crop3=new Crop({
            name:"Pulse"
        });
        cropArray.push(crop3);
    }
    if(req.body.crop4==="Maize"){
        const crop4=new Crop({
            name:"Maize"
        });
        cropArray.push(crop4);
    }
    if(req.body.crop5==="Sugarcane"){
        const crop5=new Crop({
            name:"Sugarcane"
        });
        cropArray.push(crop5);
    }
    if(req.body.crop6==="Potatoes"){
        const crop6=new Crop({
            name:"Potatoes"
        });
        cropArray.push(crop6);
    }
    if(req.body.crop7==="Onions"){
        const crop7=new Crop({
            name:"Onions"
        });
        cropArray.push(crop7)
    }

  FarmerDetail.findOne({adhar:aadhar1},function(err,item){
      if(!err){
      if(!item){
        const registernewFarmer=new FarmerDetail({
            fname:req.body.fname,
            phone:req.body.phone,
            adhar:req.body.aadhar,
            password:req.body.password,
            address:req.body.address,
            village:req.body.village,
            state:req.body.state,
            pin:req.body.pin,
            area:req.body.area,
            crop:cropArray
          });
          registernewFarmer.save();
          res.render("farmerProfile",{
            name:req.body.fname,
            phone1:req.body.phone,
            adhar:req.body.aadhar,
            password:req.body.password,
            address:req.body.address,
            village:req.body.village,
            state:req.body.state,
            pin:req.body.pin,
            area:req.body.area,
            crop:cropArray
          });
      }else{
          res.render("registerfarmer",{message:"Account already exist!! , Please login or try with another aadhar number"});
      }
    }
  });
});



app.get("/loginCompanies",function(req,res){
    res.render("loginCompanies",{message:""});
});
app.post("/loginCompanies",function(req,res){
    const email=req.body.email;
    const password=req.body.password;
     message="User i'd or password not match!!";
    CompanyDetail.findOne({email:email,password:password},function(err,foundItem){
        if(err)console.log(err);
        if(!foundItem){
            res.render("loginCompanies",{message:message});
        }else{
            res.redirect("/farmershub");
        }
    });
});


app.get("/registerCompanies",function(req,res){
    res.render("registercompanies",{message:""});
});
app.post("/registerCompanies",function(req,res){
const gstin1=req.body.gstin;
CompanyDetail.findOne({gstin:gstin1},function(err,item){
    if(!err){
        if(!item){
            const registernewcompanie=new companyDetail({
                managername:req.body.managername,
                phone:req.body.phonef,
                email:req.body.email,
                password:req.body.password,
                companyname:req.body.companyname,
                city:req.body.city,
                state:req.body.state,
                pin:req.body.pin,
                gstin:req.body.gstin
            });
                registernewcompanie.save();
                res.redirect("/farmershub");
        }else{
            res.render("registerCompanies",{message:"Account already exist!!, Please login."});
        }
    }
})

});


app.get("/farmershub",function(req,res){
FarmerDetail.find({},function(err,farmerslist){
   
    if(!err){
        res.render("farmershub",{list:farmerslist});
    }
});
});
app.post("/farmershub",function(req,res){
var area=req.body.area;
if(area>=0)area=req.body.area;
else area=1000000;

var crop=req.body.crop;
if(crop.length===3){
    FarmerDetail.find({area:{$lt:area}},function(err,farmerslist){
        if(!err){
            res.render("farmershub",{list:farmerslist});
        }
        else{
            console.log(err);
        }
    });
}

else{
FarmerDetail.find({area:{$lt:area},crop:{$elemMatch:{name:crop}}},function(err,farmerslist){
    if(!err){
        res.render("farmershub",{list:farmerslist});
    }
    else{
        console.log(err);
    }
});
}

});



app.listen(3001,function(){
    console.log("Server Started on port::3001");
});
