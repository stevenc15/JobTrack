const express = require('express');
const app = express();
const cors = require('cors');
require('./Schemas/association');

const sequelize = require('./database/database');

//connect to database
sequelize.authenticate()
    .then(() => console.log("database connected"))
    .catch((err) => console.error("error in connecting to database:", err));

//ensure tables exist
async function InitializeDatabase(){
  try{
    await sequelize.sync ({force:false});
    console.log("database tables there already or now created");
  }catch(error){
    console.error('failed tables', error);
  }
}
InitializeDatabase();

//which origin is allowed to access my backend
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,POST'
}

//apply cors middleware to every route in my app
app.use(cors(corsOptions));

//allow json parsing
app.use(express.json());

//user routes
const userRouter = require('./Routes/users');
app.use('/user', userRouter);

//job routes
const jobRouter = require('./Routes/jobs');
app.use('/job', jobRouter);

//define which port to use
const port = 5001;

// Start the server
app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});

module.exports = app;