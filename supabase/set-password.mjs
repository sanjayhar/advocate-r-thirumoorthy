import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE_KEY
);

const userId = 'e09b4886-5a67-47b6-af08-b5354e9ef87d';

const { data, error } = await supabase.auth.admin.updateUserById(
userId,
{
password: 'Sanjay@0402'
}
);

if (error) {
console.error(error);
process.exit(1);
}

console.log('Password updated successfully');
console.log(data);
