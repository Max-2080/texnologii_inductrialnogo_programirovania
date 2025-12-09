const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  
  if (Object.keys(req.body).length > 0) {
    console.log('Тело запроса:', req.body);
  }
  
  if (Object.keys(req.query).length > 0) {
    console.log('Query параметры:', req.query);
  }
  
  next();
};

module.exports = logger;
