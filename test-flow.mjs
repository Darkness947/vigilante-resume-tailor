import fs from 'fs';

async function test() {
  try {
    const fd = new FormData();
    fd.append('file', new Blob([fs.readFileSync('dummy.txt')], { type: 'text/plain' }), 'dummy.txt');
    
    console.log('Parsing...');
    const r1 = await fetch('http://localhost:3001/api/parse', {method:'POST', body:fd});
    const d1 = await r1.json();
    console.log(d1);
    
    if(!d1.success) return;
    
    console.log('Tailoring...');
    const r2 = await fetch('http://localhost:3001/api/tailor', {
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body:JSON.stringify({originalResume:d1.text, jobDescription:'Lead Security software engineer.'})
    });
    const d2 = await r2.json();
    fs.writeFileSync('test_output.json', JSON.stringify({ d1, d2 }, null, 2));

    console.log('Generating PDF...');
    const r3 = await fetch('http://localhost:3001/api/pdf', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ htmlContent: d2.data.tailored_resume_html, template: 'modern' })
    });
    const d3 = await r3.json();
    console.log(d3);

    console.log('Done mapping.');
  } catch(e) {
    console.error(e);
  }
}
test();
