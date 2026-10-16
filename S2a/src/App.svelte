<script>
    import './classless.css';
    import { roster } from './roster.svelte.js';
    import AddStudentForm from './lib/AddStudentForm.svelte';
    import RosterList from './lib/RosterList.svelte';
</script>

<header>
    <h1>Student Pets</h1>
    <output>{roster.students.length} students</output>
</header>

<AddStudentForm />
<RosterList />
