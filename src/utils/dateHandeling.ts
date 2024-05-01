
export function getCurrentDate(): string {
    const currentDate = new Date();
    const options = { timeZone: 'Africa/Cairo' }; 
    return currentDate.toISOString().replace('Z', '') + 'Z'; 
}

// Utility function to add days to a given date and return in ISO-8601 format with Egypt timezone
export function addDaysToDate(dateString: string, daysToAdd: number): string {
    const currentDate = new Date(dateString);
    const targetDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000); 
    const options = { timeZone: 'Africa/Cairo' }; 
    return targetDate.toISOString().replace('Z', '') + 'Z'; 
}
