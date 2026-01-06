





export function calcTotalDays(start: Date, end: Date)
{
    const startOnly = new Date(start);
    const endOnly = new Date(end);

    startOnly.setHours(0, 0, 0, 0);
    endOnly.setHours(0, 0, 0, 0);

    const diffMs = endOnly.getTime() - startOnly.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
    
    return diffDays;
}


export function ensureValidLeaveDates(start: Date, end: Date)
{
    if (end.getTime() < start.getTime())
    {
        throw new Error("End date cannot be before start date");
    }
}