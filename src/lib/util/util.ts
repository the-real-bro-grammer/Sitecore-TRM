export function camelCase(input: string): string {
    // converting all characters to lowercase
    let ans = input.toLowerCase();

    // Returning string to camelcase
    return ans.split(' ').reduce((s, c) => s + (c.charAt(0).toUpperCase() + c.slice(1)));
}
