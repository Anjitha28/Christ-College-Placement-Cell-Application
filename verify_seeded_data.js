const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://qcmjmdsoygrfcitnnqac.supabase.co";
const SUPABASE_KEY = "sb_publishable__scO4pQv-Xft14X53GiO0Q_XoD4VwNz";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
    console.log("=== Verifying Seeded Application Data ===");

    // 1. Check Students
    const { data: students } = await supabase.from('students').select('*');
    console.log(`Total Students: ${students.length}`);
    const depts = {};
    const courses = {};
    const classes = {};
    students.forEach(s => {
        depts[s.department] = (depts[s.department] || 0) + 1;
        courses[s.course] = (courses[s.course] || 0) + 1;
        classes[s.class] = (classes[s.class] || 0) + 1;
    });
    console.log("Students by Department:", depts);
    console.log("Students by Course:", courses);
    console.log("Students by Class:", classes);

    // 2. Check Teachers & Coordinators
    const { data: teachers } = await supabase.from('teachers').select('*');
    console.log(`Total Teachers: ${teachers.length}`);
    const teacherCoords = teachers.filter(t => t.is_coordinator);
    console.log(`Teacher Coordinators: ${teacherCoords.map(t => t.name).join(', ')}`);

    // 3. Check Class Incharges
    const { data: incharges } = await supabase.from('class_incharge').select('*');
    console.log(`Class Incharges (${incharges.length}):`, incharges.map(c => `${c.class_name} -> ${c.incharge}`).join(' | '));

    // 4. Check Training Programs, Batches, Sessions, Attendance
    const { data: programs } = await supabase.from('training_programs').select('*');
    console.log(`Total Training Programs: ${programs.length}`);
    programs.forEach(p => {
        const batchCount = (p.batches || []).length;
        const sessionCount = (p.sessions || []).length;
        const regCount = (p.registrations || []).length;
        let totalAttCount = 0;
        (p.sessions || []).forEach(s => { totalAttCount += (s.attendance || []).length; });
        console.log(`  - ${p.name}: ${regCount} registered, ${batchCount} batches, ${sessionCount} sessions, ${totalAttCount} attendance marks`);
    });

    // 5. Check Placement Activities & Recruitments
    const { data: activities } = await supabase.from('placement_activities').select('*');
    const plcs = activities.filter(a => a.type === 'placement');
    const recs = activities.filter(a => a.type === 'recruitment');
    console.log(`Placement Activities: ${plcs.length}, Recruitment Drives: ${recs.length}`);
    
    // Placed students test
    const placedStudents = new Set();
    activities.forEach(a => {
        (a.phases || []).forEach(ph => {
            const isSel = ph.isSelectedPhase === true || (ph.name && (ph.name.toLowerCase().includes('selected') || ph.name.toLowerCase().includes('final selection')));
            if (isSel) {
                (ph.completions || []).forEach(reg => placedStudents.add(reg));
            }
        });
    });
    console.log(`Total Placed Students Identified: ${placedStudents.size} (${Array.from(placedStudents).join(', ')})`);

    // 6. Check Exams & Attempts
    const { data: exams } = await supabase.from('exams').select('*');
    const { data: attempts } = await supabase.from('exam_attempts').select('*');
    console.log(`Total Exams: ${exams.length}, Total Exam Attempts: ${attempts.length}`);
    exams.forEach(e => {
        const atts = attempts.filter(a => a.exam_id === e.id);
        const passed = atts.filter(a => a.passed).length;
        console.log(`  - Exam: ${e.title} (${(e.questions || []).length} questions): ${atts.length} attempts (${passed} passed, ${atts.length - passed} failed)`);
    });

    console.log("=== Verification Completed Successfully ===");
}

verify();
