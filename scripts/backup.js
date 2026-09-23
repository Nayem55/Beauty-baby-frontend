import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { databasePath } from '../server/db.js';
const destination=path.resolve('backups');mkdirSync(destination,{recursive:true});
const name='beauty-baby-'+new Date().toISOString().replaceAll(':','-').replaceAll('.','-')+'.sqlite';
copyFileSync(databasePath,path.join(destination,name));console.log('Backup created at '+path.join(destination,name));
