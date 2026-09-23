import { all, put } from '../server/db.js';
import { hashPassword } from '../server/auth.js';
const email=(process.env.ADMIN_EMAIL||'admin@beautyandbaby.local').trim().toLowerCase();
const password=process.env.ADMIN_PASSWORD;
if(!password||password.length<10){console.error('Set ADMIN_PASSWORD to a new password of at least 10 characters before running this command.');process.exit(1);}
const user=all('users').find(u=>u.email===email&&u.role==='owner');
if(!user){console.error('No owner account exists with ADMIN_EMAIL. Start the server once to initialize it.');process.exit(1);}
put('users',{...user,password:hashPassword(password)});console.log('Owner password reset successfully.');
