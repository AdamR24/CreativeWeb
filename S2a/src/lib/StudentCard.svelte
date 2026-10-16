<script>
    import { roster } from '../roster.svelte.js';

    let { student } = $props();

    function remove() {
        roster.students.splice(roster.students.indexOf(student), 1);
    }
</script>

<li>
    <h3>{student.name}</h3>

    {#if student.pet}
        <p>{student.pet.name} the {student.pet.type.toLowerCase()}</p>
    {:else}
        <p><small>No pets.</small></p>
    {/if}

    <button onclick={remove}>Remove</button>
</li>
