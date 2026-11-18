// Offline browser bundle for the versioned global React runtime. No npm fetch required.
// Run in an environment with TypeScript installed (npm install -D typescript): node scripts/build_frontend.cjs
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
let ts;
try{ts=require('typescript')}catch(err){
  try{ts=require('/usr/local/slides_js/node_modules/typescript')}catch{console.error('Install TypeScript first with: cd frontend && npm install');process.exit(1)}
}
const src=fs.readFileSync(path.join(root,'frontend/src/main.tsx'),'utf8');
const result=ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,module:ts.ModuleKind.None},fileName:'main.tsx',reportDiagnostics:true});
if((result.diagnostics||[]).some(d=>d.category===ts.DiagnosticCategory.Error)){
  console.error(result.diagnostics.map(d=>d.messageText));process.exit(2)
}
const out=path.join(root,'frontend/dist/assets');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'app.js'),result.outputText);
fs.copyFileSync(path.join(root,'frontend/src/style.css'),path.join(out,'style.css'));
for(const file of ['react.min.js','react-dom.min.js']){
 const dir=path.join(root,'frontend/dist/vendor');fs.mkdirSync(dir,{recursive:true});
 fs.copyFileSync(path.join(root,'frontend/public/vendor',file),path.join(dir,file));
}
console.log('Generated offline React dashboard:',path.join(out,'app.js'));
