const qr = require('qr-image');

module.exports = function upload(app) {
  app.get('/qrcode', (req, res) => {
    const text = req.query.url;
    const img = qr.image(text, { size: 10 });
    res.set('Content-Type', 'image/png');
    img.pipe(res);
  });
};
