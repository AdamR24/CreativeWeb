<script>
    import { roster } from '../roster.svelte.js';
    import StudentCard from './StudentCard.svelte';
</script>

<section>
    <h2>Roster</h2>

    {#if roster.students.length === 0}
        <p>No students are in the roster.</p>
    {:else}
        <ul>
            {#each roster.students as student (student)}
                <StudentCard {student} />
            {/each}
        </ul>
    {/if}
</section>
