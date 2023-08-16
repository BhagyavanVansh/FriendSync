const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://vanshbhagyavan:FOND4tfrhgS62Ilb@cluster0.g7t6gfi.mongodb.net/?retryWrites=true&w=majority";

  try {
    const connect = await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
