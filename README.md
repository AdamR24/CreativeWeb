# Initial Concept

My (current) idea is a binary analysis tool, visualising traits about the binary you upload, and comparing it to binaries uploaded in the past that are stored in a database.

My current plan on doing this is using a mix of visible strings, IAT enumeration, and signature scanning, however I could potentially use an LLM for it, albeit at a large speed penalty. For now i've ruled out the idea, as I would have to setup a full sandboxed environment + harness for it to work in.

Another idea I had was uploading the binary to a service such as Virustotal, which scans a binary with most major anti malware solutions, and I could present the score as another data point.

I intend to limit the scope to PE files (Windows binaries), although it would be possible to expand this to Mach-O (Mac) and ELF (Linux) in the future. While some features that aren't reliant on the binary format would work, others such as IAT enumeration would need adjustments.

I plan to use A SQL based database (mariadb) for this, as the relational aspect will make it far easier to do the comparisons between binaries.

The main challenge I still need to work out before committing to the idea is how I am going to make the visualizations creative and not just a set of boring graphs. I am considering some kind of spider web for the comparisons, but I am still unsure for viewing information about a single binary.