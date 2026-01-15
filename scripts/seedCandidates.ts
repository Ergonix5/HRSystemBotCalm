import { connectDB } from "../src/lib/db";
import { Candidate } from "../src/app/models/candidate.model";

const seedCandidates = [
  {
    candidate_id: "CAN-001",
    first_name: "Nimal",
    last_name: "Perera",
    email: "n.perera@example.com",
    phone: "+94771234567",
    current_position: "Senior Software Engineer",
    experience_years: 5,
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    source: "LinkedIn",
    status: "Shortlisted",
  },
  {
    candidate_id: "CAN-002",
    first_name: "Janaka",
    last_name: "Silva",
    email: "j.silva@example.com",
    phone: "+94772345678",
    current_position: "UI/UX Designer",
    experience_years: 3,
    skills: ["Figma", "Adobe XD", "UI Design"],
    source: "Company Website",
    status: "Interview",
  },
];

async function seed() {
  await connectDB();
  await Candidate.deleteMany({});
  await Candidate.insertMany(seedCandidates);
  console.log("✅ Seeded candidates");
  process.exit(0);
}

seed();
