app.use((err, req, res, next) => {
  console.error(err);
  res.send({ message: err.message });
});
