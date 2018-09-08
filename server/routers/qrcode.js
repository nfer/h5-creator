const qr = require('qr-image');

function genQrcode(req, res) {
  const text = req.query.url;
  const img = qr.image(text, { size: 10 });
  res.set('Content-Type', 'image/png');
  img.pipe(res);
}

module.exports = function upload(app) {
  app.get('/qrcode', genQrcode);
  app.get('/cgi/qrcode', genQrcode);
};
