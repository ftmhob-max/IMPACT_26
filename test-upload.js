const fs = require('fs');
async function test() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const data = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\n%PDF-1.4\r\n%EOF\r\n--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\ntest\r\n--${boundary}--`;
  const res = await fetch('http://localhost:3001/api/admin/materials', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Cookie': 'session=dummy'
    },
    body: data
  });
  console.log(res.status, await res.text());
}
test();
