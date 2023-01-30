const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
var imagepath = '';
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log(file);
		cb(null, './Public/Images');
	},
	filename: (req, file, cb) => {
		imagepath = '/images/' + file.originalname;
		cb(null, file.originalname);
	},
});
const port=process.env.PORT ||8000;
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('Public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
	.connect(process.env.DB_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('mongodb connected');
	});

const { Schema } = mongoose;

const Carschema = new Schema({
	id: Number,
	category_id: Number,
	title: String,
	seo_title: String,
	starting_price: Number,
	seo_tag: String,
	seo_desc: String,
	position: Number,
	description: String,
	image: String,
	file: String,
	updated_at: String,
});

const productschema = new Schema({
	id: Number,
	category_id: Number,
	car_model_id: Number,
	varient_id: Number,
	name: String,
	transmission: String,
	fuel: String,
	body: String,
	about_car: String,
	price: Number,
	route: String,
	description: String,
	color_name: String,
	color_name2: String,
	colour_code: String,
	colour_code2: String,
	status: Number,
	created_at: String,
	updated_at: String,
	images: [
		{
			id: Number,
			product_id: Number,
			images: String,
			created_at: String,
			updated_at: String,
		},
	],
});
const varientschema = new mongoose.Schema({
	id: Number,
	car_model_id: Number,
	var_title: String,
	description: String,
	created_at: String,
	updated_at: String,
	products: [
		{
			id: Number,
			category_id: Number,
			car_model_id: Number,
			varient_id: Number,
			name: String,
			transmission: String,
			fuel: String,
			body: String,
			about_car: String,
			price: Number,
			route: String,
			description: String,
			color_name: String,
			color_name2: String,
			colour_code: String,
			colour_code2: String,
			status: Number,
			created_at: String,
			updated_at: String,
			image: String,
			images: [
				{
					id: Number,
					product_id: Number,
					images: String,
					created_at: String,
					updated_at: String,
				},
			],
		},
	],
	specifications: [
		{
			id: Number,
			specname_id: Number,
			varient_id: Number,
			specname: String,
			value: String,
			status: Number,
			created_at: String,
			updated_at: String,
		},
	],
	interior_images: [
		{
			id: Number,
			varient_id: Number,
			title: String,
			interior_images: String,
			int_description: String,
			created_at: String,
			updated_at: String,
		},
	],
});
const imageschema = new Schema({
	name: String,
	image: String,
});
const Cardetailschem = new Schema({
	id: Number,
	category_id: Number,
	title: String,
	seo_title: String,
	starting_price: Number,
	seo_tag: String,
	seo_desc: String,
	position: Number,
	description: String,
	image: String,
	file: String,
	updated_at: String,
	varients: [
		{
			id: Number,
			car_model_id: Number,
			var_title: String,
			description: String,
			created_at: String,
			updated_at: String,
			products: [
				{
					id: Number,
					category_id: Number,
					car_model_id: Number,
					varient_id: Number,
					name: String,
					transmission: String,
					fuel: String,
					body: String,
					about_car: String,
					price: Number,
					route: String,
					description: String,
					color_name: String,
					color_name2: String,
					colour_code: String,
					colour_code2: String,
					status: Number,
					created_at: String,
					updated_at: String,
					images: [
						{
							id: Number,
							product_id: Number,
							images: String,
							created_at: String,
							updated_at: String,
						},
					],
				},
			],
			specifications: [
				{
					id: Number,
					specname_id: Number,
					varient_id: Number,
					specname: String,
					value: String,
					status: Number,
					created_at: String,
					updated_at: String,
				},
			],
			interior_images: [
				{
					id: Number,
					varient_id: Number,
					title: String,
					interior_images: String,
					int_description: String,
					created_at: String,
					updated_at: String,
				},
			],
		},
	],
});
app.post('/upload', upload.array('files'), (req, res) => {
	console.log(req.body);
	let image = new Image({
		name: req.body.name,
		image: imagepath,
	});
	image.save((err, res) => {
		if (err) {
			console.log(err);
		} else {
			console.log(res);
		}
	});
	res.send('file uploaded');
});
app.get('/upload', (req, res) => {
	res.sendFile(path.resolve('/Images/clipart2117600.png'));
});
app.get('/image', async function (req, response) {
	Image.find((err, res) => {
		if (err) {
			console.log(err);
		} else {
			response.render('main.ejs', {
				entries: res,
			});
		}
	});
});
app.delete('/image', async function (req, response) {
	let img=req.body.ima;
	console.log(img)
	Image.find({image:img}).remove((err, res) => {
		if (err) {
			console.log(err);
		} else {
// res.remove();
console.log(res)
response.send("removed successfully")
		}
	});
});

app.get('/allcars', (req, response) => {
	8;

	Car.find((err, res) => {
		if (err) {
			console.log(err);
		} else {
			response.send(res);
		}
	});
});
app.get("/",async (re,res)=>{
	await res.render("navigator.ejs")
})
app.get('/query/:string?', (req, response) => {
	console.log(req.params.string);
	const s = req.params.string;
	const regex = new RegExp(s, 'i'); // i for case insensitive
	if(s===undefined||s.length<3){
		response.send("please enter query with minimum 3 Characters in url")
	}else{
	Product.find({ name: { $regex: regex } }, (err, res) => {
		if (err) {
			console.log(err);
		} else {
			// response.send(res);
			response.render('carquery.ejs', { cars: res });
		}
	});
	}

});
app.get('/cardetail/:id', (req, response) => {
	console.log(req.params.id);

	Varient.find(
		{ car_model_id: req.params.id },
		{
			id: 1,
			car_model_id: 1,
			created_at: 1,
			updated_at: 1,
			var_title: 1,
			description: 1,
			image: 1,
		},
		(err, res) => {
			if (err) {
				console.log(err);
			} else {
				response.send(res);
			}
		}
	);
});

const Car = mongoose.model('Car', Carschema);

const Cardetail = mongoose.model('Cardetail', Cardetailschem);
const Product = mongoose.model('Product', productschema);
const Varient = mongoose.model('Varient', varientschema);
const Image = mongoose.model('Image', imageschema);

app.listen(port, () => {
	console.log('Server is running at port 8000');
});
