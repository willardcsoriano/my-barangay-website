// create_test_users.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' }); // Load .env.local keys

// --- Load Secrets ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ ERROR: Missing keys. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local.");
  process.exit(1);
}

// Create the Admin client using the Service Role Key (HTTP API access)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const testUsers = [
  { email: 'admin@barangay.ph', password: 'Secure!123', role: 'admin', first_name: 'Admin', last_name: 'Staff' },
  { email: 'juan@barangay.ph', password: 'Secure!123', role: 'resident', first_name: 'Juan', last_name: 'Dela Cruz' },
  { email: 'maria@barangay.ph', password: 'Secure!123', role: 'resident', first_name: 'Maria', last_name: 'Santos' },
];

async function seedUsers() {
  console.log('Starting user creation via Admin API...');
  
  // 1. Create Users
  for (const user of testUsers) {
    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Auto-confirms the email for testing
      user_metadata: { 
        first_name: user.first_name, 
        last_name: user.last_name 
      },
    });

    if (error) {
      // The only expected error is "User already exists," which is fine.
      if (!error.message.includes('already exists')) {
        console.error(`❌ Failed to create ${user.email}:`, error.message);
        continue;
      }
    }
    
    // 2. Set Custom Role (Updates the public.profiles table)
    const userId = authData?.user?.id;
    if (userId) {
        // This relies on your existing public.profiles table and structure
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ user_role: user.role })
            .eq('id', userId);

        if (profileError) {
            console.error(`❌ Failed to set role for ${user.email}:`, profileError.message);
        } else {
            console.log(`✅ User created and role set: ${user.email} (${user.role})`);
        }
    }
  }
  
    // 3. Insert Test Clearance Request
    console.log('\nInserting test clearance request...');
    
    // Find Maria's UUID (The most reliable way across client versions is listUsers)
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 100, // Fetch up to 100 users, assuming few test users
    });
    
    if (listError) {
        console.error('❌ Failed to list users for lookup:', listError.message);
        return;
    }
    
    const mariaUser = usersData.users.find(u => u.email === 'maria@barangay.ph');
    const mariaId = mariaUser?.id;

  if (mariaId) {
    const { error: insertError } = await supabaseAdmin.from('clearance_requests').insert({
        resident_id: mariaId,
        clearance_type: 'Certificate of Residency',
        purpose: 'Employment Requirement',
        status: 'Pending',
    });

    if (insertError) {
      console.error('❌ Failed to insert request:', insertError.message);
    } else {
      console.log('✅ Pending clearance request created for Maria.');
    }
  } else {
      console.error('❌ Could not find Maria to create the request.');
  }

  console.log('\n--- Seeding Complete ---');
}

seedUsers();