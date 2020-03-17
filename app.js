const express = require('express')
const app = express()
const methodOverride = require('method-override')
const mongoose = require('mongoose');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost/blogDB', {useNewUrlParser: true});

const BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type:Date, default: Date.now}

});

const Blog = mongoose.model('Blog', BlogSchema);

app.get('/', function (req, res) {
  res.redirect('/blogs')
})

app.get('/blogs', function (req, res) {
  Blog.find({}, function(err, blogs){
  	if(err){
  		console.log(err)
  	} else{
  		res.render('index', {blogs:blogs})

  	}
  })
})

app.get('/blogs/new', function (req, res) {
  res.render('new')
})




app.post('/blogs', function (req, res) {
  const userTitle= req.body.title
  const userImage =  req.body.image
  const userContent =  req.body.content
console.log(userTitle)

Blog.create(
{
  title: userTitle,
  image: userImage,
  body: userContent
  
}, 
function(err, userblog){
	if(err){
		console.log(err)
	} else{
		res.redirect('/blogs')
		
	}
}

)


})

//Read more page
app.get('/blogs/:id', function (req, res) {
 Blog.findById(req.params.id, function (err, blogshow) {
  if(err){
    console.log("There is a error")
  } else{
      res.render('show', {blogshow:blogshow})
  }
 });

})

//Edit route form  
app.get('/blogs/:id/edit', function (req, res) {
 Blog.findById(req.params.id, function (err, editContent) {
  if(err){
    console.log("There is a error")
  } else{
      res.render('edit', {editContent:editContent})
  }
 });

})



//PUT route for edit form  
app.put('/blogs/:id', function (req, res) {
 Blog.update(
  {_id:req.params.id}, 
  { title: req.body.title, image: req.body.image, body:req.body.content }, 
  { overwrite: true },
  function(err){
    if(err){
      console.log(err)
    } else{
      res.redirect("/blogs/" + req.params.id)
    }
  });

})


//DELETE route for edit form  
app.delete('/blogs/:id', function (req, res) {
 Blog.findByIdAndRemove(req.params.id, function(err){
  if(err){
    console.log("It was a error")
  }else{
    res.redirect("/blogs")
  }
 })

})




app.listen(process.env.PORT||3000 , process.env.IP, () =>{
console.log("Server has started!!")
});