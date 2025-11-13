// lib/utils/official-hierarchy.ts

// Define the structure for a single hierarchical position
export type OfficialPosition = {
    id: string; // Unique, constant ID (e.g., 'captain')
    title: string; // Display name (e.g., 'Barangay Captain')
    order: number; // The unique, fixed position in the hierarchy (1, 2, 3, etc.)
};

// Define the authoritative list of positions in descending order of hierarchy (ascending order number)
export const OFFICIAL_HIERARCHY: OfficialPosition[] = [
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
    { id: 'utility', title: 'Utility Worker', order: 12 },
    // Add more positions as needed
];

// Helper to get the order number from the title (for Server Actions)
export function getOrderFromPosition(title: string): number {
    const position = OFFICIAL_HIERARCHY.find(p => p.title === title);
    // If a position is not found (shouldn't happen with the dropdown), default to a high number
    return position ? position.order : 99; 
}