const express = require('express');
const app = express();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

app.set('view engine', 'ejs');
const corsOptions = {
  origin: 'https://cognifront-deploy-test.vercel.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));



cloudinary.config({ 
  cloud_name: 'dvdsfjxtq',
  api_key: '699819965264748', 
  api_secret: 'w8JQW4hDLigwKj1iPRKFtEqEQOo'
});

const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'myfolder', //  folder name in cloudinary storage
    format: async (req, file) => {
      // Extract the file format from the original file
      const format = file.originalname.split('.').pop().toLowerCase();
      return format; /// return format to 
  },
}});

const upload = multer({ storage: cloudinaryStorage });

const Image = mongoose.model('Image', {
  cloudinaryId: String,
  url: String,
  date : String  ,
  time: String , 
  platform : String,
  message : String
});




const dbUrl = 'mongodb+srv://akshayRajput:Akx182099@cluster0.iuv44rt.mongodb.net/cognifront';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// for telegram service
const botToken = '6887733591:AAEZs6gprW1KFKlF3X0l3-BJ3jermE74F8o'; // Replace with your Telegram bot token
const bot = new TelegramBot(botToken, { polling: false });

// for email

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akshaygirase122003@gmail.com',
    pass: 'tdmjtjmjrpywjzql',
  },
});



// for simple messages ::: 

const twilioAccountSid = 'ACcb60887625ea2c9cece37a9d14dea577';
const twilioAuthToken = '8788cdd47b2b6c90295eda6ef0cfae57';
const twilioPhoneNumber = '+12059735617';

const twilioClient = new twilio(twilioAccountSid, twilioAuthToken);
const numbers = ['+918459182099'];

const recipients = ['akxrajput@gmail.com' , ];
let cid = '';
app.post('/api/upload', upload.single('image'), async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });      // akshay girase
    }
    cid = req.file.filename.substring(9);
    // Continue with processing the uploaded file
    const newImage = new Image({
      cloudinaryId: req.file.filename.substring(9),
      url: req.file.path,
      date :dd,
      time : tt , 
      platform :currentPlatform , 
      message : cap
    });

    await newImage.save();

    const message = cap;
    const imageFileId = req.file.path;

    sendImageAndMessageToTelegram(message, imageFileId);
    sendEmailToRecipients(message, imageFileId, recipients);

    const mediaUrl = req.file.path; // Get the secure URL of the uploaded image

    // Iterate through selected numbers and send MMS
    numbers.forEach(async (number) => {
      try {
        const messageSid = await twilioClient.messages.create({
          body: message,
          mediaUrl: [mediaUrl],
          to: number,
          from: twilioPhoneNumber,
        });

        console.log(`MMS sent to ${number}: ${messageSid.sid}`);
      } catch (error) {
        console.error(`Error sending MMS to ${number}: ${error.message}`);
      }
    });

    res.json({ message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//// Function to send email with image to multiple recipients    ///////
function sendEmailToRecipients(message, imageFileId, recipients) {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: recipients.join(','), // Join the array of recipients into a comma-separated string
    subject: 'testing purpose please ignore this',
    text: message,
    attachments: [
      {
        filename: 'your_image.jpg',
        path: imageFileId, // Path to the uploaded image
        cid: cid, // Use this to reference the image in the email body
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to send image and message to Telegram users
function sendImageAndMessageToTelegram(message, imageFileId) {
  const userChatIds = ['5297187575' , '5788495654' ];

  userChatIds.forEach(chatId => {
    bot.sendPhoto(chatId, imageFileId, { caption: message })
      .then(sentPhoto => console.log(`Photo sent to ${chatId}: ${sentPhoto.photo[0].file_id}`))
      .catch(error => console.error(`Error sending photo to ${chatId}: ${error.message}`));
  });
}




// platform :: Sms , Telegram , email


app.use(express.json());
const Platform = mongoose.model('Platform', {
     
     platform : String ,
});

let currentPlatform = '';
app.post('/api/platform' , async function( req , res){
      try { 
        

        const platformData = req.body.platform;

        // Filter properties with a value of true
        const selectedOptions = Object.keys(platformData).filter(key => platformData[key] === true);
        console.log(selectedOptions);

        currentPlatform = selectedOptions.join(', ');
        const platform = new Platform({
          platform :currentPlatform,
        });
        await platform.save();

        res.json({
          msg : "platform uploaded successfully" ,
          platform : platform, 
        })

     }catch(error){
      console.log(error)
      res.json({
          msg : " internal server error" 
      })
     }

})


// now time 

app.use(express.json());

const TimeData = mongoose.model('TimeData', {
  date: String, // Separate field for date
  time: String, // Separate field for time
});

let dd = '';
let tt = '';
app.post('/api/time', async (req, res) => {
  try {
    const { dateTime } = req.body;

    // Split the dateTime into date and time
    const [date, time] = dateTime.split(', ');
    dd = date;
    tt = time;
    
    console.log(dateTime);
    // Save the dateTime to the MongoDB collection
    const timeData = new TimeData({
      date,
      time,
    });
    await timeData.save();

    res.json({ message: 'DateTime saved successfully', timeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// for caption ::



// Endpoint to receive caption
let cap = "";
app.post('/api/caption', (req, res) => {
  const { caption } = req.body;

  console.log( req.body)
  // Process the caption as needed
  console.log('Received caption:', caption);
  cap = caption;

  // Assuming a success response
  res.json({ success: true, message: 'Caption received successfully' });
});


//ejs 

// Render the EJS template with data
app.get('/form', async (req, res) => {
  try {
    // Fetch data from the MongoDB collection (Assuming 'Image' is your model)
    const data = await Image.find();

    // Render the EJS template and pass the data
    res.render(__dirname + '/views/form.ejs', { data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
