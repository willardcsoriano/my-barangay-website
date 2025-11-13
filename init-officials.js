// init-officials.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

// --- Configuration ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE_NAME = 'officials';

// --- Official Hierarchy (Must match your /lib/utils/official-hierarchy.ts) ---
const OFFICIAL_HIERARCHY = [
    { id: 'captain', title: 'Barangay Captain', order: 1 },
    { id: 'secretary', title: 'Barangay Secretary', order: 2 },
    { id: 'treasurer', title: 'Barangay Treasurer', order: 3 },
    { id: 'councilor-1', title: 'Barangay Councilor (Puno)', order: 4 },
    { id: 'councilor-2', title: 'Barangay Councilor (Kagawad 2)', order: 5 },
    { id: 'councilor-3', title: 'Barangay Councilor (Kagawad 3)', order: 6 },
    { id: 'councilor-4', title: 'Barangay Councilor (Kagawad 4)', order: 7 },
    { id: 'councilor-5', title: 'Barangay Councilor (Kagawad 5)', order: 8 },
    { id: 'councilor-6', title: 'Barangay Councilor (Kagawad 6)', order: 9 },
    { id: 'councilor-7', title: 'Barangay Councilor (Kagawad 7)', order: 10 },
    { id: 'sk-chair', title: 'SK Chairperson', order: 11 },
];

function getOrderFromPosition(title) {
    const position = OFFICIAL_HIERARCHY.find(p => p.title === title);
    return position ? position.order : 99;
}

// --- Data to Insert (REPLACE WITH ACTUAL MARIKINA HEIGHTS DATA) ---
const MARIKINA_HEIGHTS_OFFICIALS_DATA = [
    { 
        position: 'Barangay Captain', 
        name: 'Hon. Placeholder Juan Dela Cruz', // ⬅️ REPLACE NAME
        contact_number: '0917-000-1111', 
        email: 'captain@marikinaheights.ph' 
    },
    { 
        position: 'Barangay Secretary', 
        name: 'Jane Doe', // ⬅️ REPLACE NAME
        contact_number: null, 
        email: 'secretary@marikinaheights.ph' 
    },
    { 
        position: 'Barangay Treasurer', 
        name: 'Mark Smith', // ⬅️ REPLACE NAME
        contact_number: '0998-555-4444', 
        email: null 
    },
    { 
        position: 'Barangay Councilor (Puno)', 
        name: 'Councilor Uno', // ⬅️ REPLACE NAME
        contact_number: null, 
        email: null 
    },
    // ... add all 7 councilors, SK Chair, etc. here ...
];

// --- Main Execution Function ---
async function initializeOfficials() {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
        console.error("FATAL: Supabase environment variables are not set.");
        return;
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
    });

    // 1. Prepare data with fixed ordering
    const officialsToInsert = MARIKINA_HEIGHTS_OFFICIALS_DATA.map(official => ({
        ...official,
        // The ordering column is still required by the DB for sorting
        ordering: getOrderFromPosition(official.position), 
        image_url: null, // Start without images
    }));

    console.log(`Attempting to insert ${officialsToInsert.length} officials...`);
    
    // 2. Insert data into Supabase
    const { error } = await supabaseAdmin
        .from(TABLE_NAME)
        .insert(officialsToInsert)
        .select();

    if (error) {
        console.error("❌ Failed to insert officials:", error.message);
        console.log("Check if the 'ordering' column exists in your DB, as the type definition requires it.");
    } else {
        console.log("✅ Successfully initialized officials in the database.");
    }
}

initializeOfficials();