<script>
    import { roster } from '../roster.svelte.js';

    let studentName = $state('');
    let petName = $state('');
    let petType = $state('Dog');

    function addStudent(event) {
        event.preventDefault();
        if (!studentName.trim()) return;

        roster.students.push({
            name: studentName.trim(),
            pet: petName.trim() ? { name: petName.trim(), type: petType } : null,
        });

        studentName = '';
        petName = '';
        petType = 'Dog';
    }
</script>

<form onsubmit={addStudent}>
    <h2>Add a student</h2>

    <label>
        Student name
        <input bind:value={studentName} placeholder="Meow" required />
    </label>

    <label>
        Pet name
        <input bind:value={petName} placeholder="Mr Woof" />
    </label>

    {#if petName.trim()}
        <label>
            Pet type
            <select bind:value={petType}>
                <option>Dog</option>
                <option>Cat</option>
                <option>Rabbit</option>
                <option>Fish</option>
                <option>Hamster</option>
                <option>Other</option>
            </select>
        </label>
    {/if}

    <button type="submit">Add to roster</button>
</form>
