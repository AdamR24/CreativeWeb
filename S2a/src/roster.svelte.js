// Shared state: every component that imports `roster` sees the same data.
// Each student has a name and either a pet ({ name, type }) or null.
export const roster = $state({
    students: [
        { name: 'Aisha', pet: { name: 'Biscuit', type: 'Dog' } },
        { name: 'Tom', pet: null },
    ],
});
