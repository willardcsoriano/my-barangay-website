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

// --- COMPLETE BARANGAY OFFICIALS LIST (PLACEHOLDER DATA) ---
const MARIKINA_HEIGHTS_OFFICIALS_DATA = [
  // Main Officials
  {
    position: "Barangay Captain",
    name: "Hon. Juan Dela Cruz",
    contact_number: "0917-000-1111",
    email: "captain@marikinaheights.ph"
  },
  {
    position: "Barangay Secretary",
    name: "Maria Isabella Santos",
    contact_number: "0917-200-3344",
    email: "secretary@marikinaheights.ph"
  },
  {
    position: "Barangay Treasurer",
    name: "Roberto Villanueva",
    contact_number: "0998-555-4444",
    email: "treasurer@marikinaheights.ph"
  },

  // Barangay Councilors (7 Kagawads)
  {
    position: "Barangay Kagawad",
    committee: "Peace and Order",
    name: "Kagawad Antonio Reyes",
    contact_number: null,
    email: null
  },
  {
    position: "Barangay Kagawad",
    committee: "Health and Sanitation",
    name: "Kagawad Liza Fernandez",
    contact_number: null,
    email: null
  },
  {
    position: "Barangay Kagawad",
    committee: "Education",
    name: "Kagawad Miguel Bautista",
    contact_number: null,
    email: null
  },
  {
    position: "Barangay Kagawad",
    committee: "Infrastructure",
    name: "Kagawad Jerome Pascual",
    contact_number: null,
    email: null
  },
  {
    position: "Barangay Kagawad",
    committee: "Environmental Protection",
    name: "Kagawad Andrea Castillo",
    contact_number: null,
    email: null
  },
  {
    position: "Barangay Kagawad",
    committee: "Livelihood Programs",
    name: "Kagawad Steven Ramos",
    contact_number: null,
    email: null
  },
  {
    position: "Barangay Kagawad",
    committee: "Sports and Youth Development",
    name: "Kagawad Bianca Cruz",
    contact_number: null,
    email: null
  },

  // SK Officials
  {
    position: "SK Chairperson",
    name: "SK Chair Gabriel Mendoza",
    contact_number: "0917-999-8899",
    email: "skchair@marikinaheights.ph"
  },
  {
    position: "SK Kagawad",
    name: "SK Kagawad Alyssa Santos",
    contact_number: null,
    email: null
  },
  {
    position: "SK Kagawad",
    name: "SK Kagawad Carlo Rivera",
    contact_number: null,
    email: null
  },
  {
    position: "SK Kagawad",
    name: "SK Kagawad Denise Angeles",
    contact_number: null,
    email: null
  },
  {
    position: "SK Kagawad",
    name: "SK Kagawad Nathan Villena",
    contact_number: null,
    email: null
  },
  {
    position: "SK Secretary",
    name: "SK Sec. Felicity Gomez",
    contact_number: null,
    email: null
  },
  {
    position: "SK Treasurer",
    name: "SK Treasurer Paolo Gutierrez",
    contact_number: null,
    email: null
  },

  // Public Safety Staff
  {
    position: "Chief Tanod",
    name: "Chief Tanod Armando Salcedo",
    contact_number: "0918-778-2233",
    email: null
  },

  // Multiple barangay tanods
  ...[
    "Tanod Pedro Morales",
    "Tanod Ronnie Evangelista",
    "Tanod Carlos Dominguez",
    "Tanod Victor Hernandez",
    "Tanod Manuel Diaz",
  ].map(name => ({
    position: "Barangay Tanod",
    name,
    contact_number: null,
    email: null
  })),

  // Health workers
  {
    position: "Barangay Health Worker (BHW)",
    name: "BHW Aileen Dizon",
    contact_number: null,
    email: null
  },
  {
    position: "Barangay Health Worker (BHW)",
    name: "BHW Rosalinda Javier",
    contact_number: null,
    email: null
  },

  // Nutrition Scholar
  {
    position: "Barangay Nutrition Scholar (BNS)",
    name: "BNS Clarisse Montoya",
    contact_number: null,
    email: null
  },

  // Administrative staff
  {
    position: "Barangay Clerk",
    name: "Clerk Samantha De Vera",
    contact_number: null,
    email: null
  }
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