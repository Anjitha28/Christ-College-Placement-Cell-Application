    // Global profile handlers
    window.openProfile = () => {
        const modal = document.getElementById('teacherProfileModal');
        if (modal) modal.classList.remove('hidden');
    };
    
    window.closeProfile = () => {
        const modal = document.getElementById('teacherProfileModal');
        if (modal) modal.classList.add('hidden');
    };

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Route UI Synchronously before DB loads to prevent ANY dashboard flash
    try {
        handleRouting(true); 
    } catch(e) {
        console.warn("Early UI routing failed:", e);
    }

    await db.ready;

    checkAuth(['teacher', 'teacherCoordinator']);
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const userRole = sessionStorage.getItem('userRole');

    if (!user || (userRole !== 'teacher' && userRole !== 'teacherCoordinator')) return;

    // Check for forced password reset
    const teachers = db.getTeachers();
    const currentTeacher = teachers.find(t => t.phoneNumber === user.phoneNumber);
    if (currentTeacher && (currentTeacher.forcePasswordReset || currentTeacher.password === 'password')) {
        const modal = document.getElementById('resetPassModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('saveNewPassBtn').onclick = async () => {
                const newPass = document.getElementById('newPass').value;
                const confirmPass = document.getElementById('confirmPass').value;
                if (newPass.length < 6) {
                    alert('Password must be at least 6 characters long.');
                    return;
                }
                if (newPass !== confirmPass) {
                    alert('Passwords do not match.');
                    return;
                }
                const result = await db.changePassword('teacher', user.phoneNumber, newPass);
                if (result.success) {
                    alert('Password updated successfully! Please login again.');
                    logout();
                } else {
                    alert(result.message || 'Error updating password.');
                }
            };
        }
    }

    // Header logic
    const teacherNameEl = document.getElementById('teacherName');
    if (teacherNameEl) teacherNameEl.textContent = `Welcome, ${user.name}`;
    const userRoleEl = document.querySelector('.user-role');
    const isCoord = userRole === 'teacherCoordinator' || user.isCoordinator === true || user.isCoordinator === 'true';
    if (userRoleEl) userRoleEl.textContent = isCoord ? 'Teacher Coordinator' : 'Teacher Portal';

    if (isCoord) {
        const coordLink = document.getElementById('coordPortalLink');
        if (coordLink) coordLink.classList.remove('hidden');
    }

    // Fill Profile Modal
    const pDeptEl = document.getElementById('pDept');
    const pPhoneEl = document.getElementById('pPhone');
    const pEmailEl = document.getElementById('pEmail');
    const pNameEl = document.getElementById('pName');
    
    if (pDeptEl) pDeptEl.textContent = user.department || 'N/A';
    if (pPhoneEl) pPhoneEl.textContent = user.phoneNumber || 'N/A';
    if (pEmailEl) pEmailEl.textContent = user.mailId || 'N/A';
    if (pNameEl) pNameEl.textContent = user.name || 'N/A';


    // --- UI State & Tab Navigation (Persistent across refresh) ---
    function activateTab(tabId, uiOnly = false) {
        const tab = document.querySelector(`.sidebar-link.tab[data-tab="${tabId}"]`);
        const tabContent = document.getElementById(`${tabId}Tab`);
        
        if (!tab || !tabContent) return;

        document.querySelectorAll('.sidebar-link.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        tabContent.classList.add('active');
        
        // Scroll to top when navigating to a new section
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update breadcrumb and title
        const breadcrumb = document.querySelector('.breadcrumb');
        const pageTitle = document.querySelector('.page-title');
        
        if (breadcrumb && pageTitle) {
            const tabName = tab.textContent.trim();
            breadcrumb.textContent = `Portal / ${tabName}`;
            pageTitle.textContent = tabName;
        }

        if (uiOnly) return;

        try {
            if (tabId === 'dashboard') {
                renderTeacherDashboard();
            } else if (tabId === 'calendar') {
                renderProgramCalendar();
            }
        } catch (e) {
            console.warn(`Error rendering tab ${tabId}:`, e);
        }
    }

    const tabs = document.querySelectorAll('.sidebar-link.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = tab.dataset.tab;
            if (window.location.hash === '#' + targetTab) {
                activateTab(targetTab, false);
            } else {
                window.location.hash = targetTab;
            }
        });
    });

    window.addEventListener('hashchange', () => handleRouting(false));

    function handleRouting(uiOnly = false) {
        const hash = window.location.hash.substring(1) || 'dashboard';
        const parts = hash.split('/');
        const mainTabId = parts[0] || 'dashboard';
        
        activateTab(mainTabId, uiOnly);
    }

    // --- Department Scope Resolution ---
    const userDept = (currentTeacher?.department || user.department || '').trim();
    console.log(`[Teacher Portal] Active Teacher: ${user.name || user.phoneNumber}, Department: "${userDept}"`);

    // Dynamically retrieve department students
    function getDeptStudents() {
        return (db.getStudents() || []).filter(s => (s.department || '').trim().toLowerCase() === userDept.toLowerCase());
    }

    function getDeptCourses() {
        const dStudents = getDeptStudents();
        return new Set(dStudents.map(s => s.course).filter(Boolean));
    }

    function isItemForDept(item) {
        if (!item) return false;
        const target = item.target || {};
        if (!target.type || target.type === 'all') return true;
        
        const dCourses = getDeptCourses();
        const dStudents = getDeptStudents();
        const dStudentRegNos = new Set(dStudents.map(s => s.registerNumber));

        if (target.type === 'dept') {
            return Array.isArray(target.depts) && target.depts.some(d => (d || '').trim().toLowerCase() === userDept.toLowerCase());
        }
        if (target.type === 'course') {
            return Array.isArray(target.courses) && target.courses.some(c => dCourses.has(c));
        }
        if (target.type === 'student') {
            return Array.isArray(target.students) && target.students.some(reg => dStudentRegNos.has(reg));
        }
        return false;
    }

    // --- Teacher Dashboard Rendering ---
    function renderTeacherDashboard() {
        const deptStudents = getDeptStudents();
        const totalStudents = deptStudents.length;
        const deptStudentRegNos = new Set(deptStudents.map(s => s.registerNumber));
        const deptCourses = getDeptCourses();

        // 1. Total Students Card
        const totalStudentsEl = document.getElementById('dashTotalStudents');
        if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;

        // 2. Fetch scoped trainings and activities
        const allTrainings = (db.getTrainingPrograms() || []).filter(isItemForDept);
        const allActivities = (db.getPlacementActivities() || []).filter(isItemForDept);
        const deptPlacementActs = allActivities.filter(a => a.type !== 'recruitment');
        const deptRecruitments = allActivities.filter(a => a.type === 'recruitment');

        // Card D: Total Trainings
        const totalTrainingsEl = document.getElementById('dashTotalTrainings');
        if (totalTrainingsEl) totalTrainingsEl.textContent = allTrainings.length;

        // Card E: Placement Activities
        const totalActsEl = document.getElementById('dashTotalActivities');
        if (totalActsEl) totalActsEl.textContent = deptPlacementActs.length;

        // Card F: Total Recruitments
        const totalRecEl = document.getElementById('dashTotalRecruitments');
        if (totalRecEl) totalRecEl.textContent = deptRecruitments.length;

        // Card C: Placed Students (Canonical Placement Logic)
        const placedDeptStudents = deptStudents.filter(s => db.isStudentPlaced(s.registerNumber));
        const placedDeptStudentRegNos = new Set(placedDeptStudents.map(s => s.registerNumber));
        const placedCount = placedDeptStudents.length;
        const placedStudentsEl = document.getElementById('dashPlacedStudents');
        if (placedStudentsEl) placedStudentsEl.textContent = placedCount;

        // Card B: Registered Recruitments
        // Count of recruitment drives applicable to department having registered students from teacher's department
        const deptRegisteredRecruitments = deptRecruitments.filter(a => {
            const regs = a.registrations || a.registeredStudents || [];
            return regs.some(reg => deptStudentRegNos.has(reg));
        }).length;
        const regRecEl = document.getElementById('dashRegisteredRecruitments');
        if (regRecEl) regRecEl.textContent = deptRegisteredRecruitments;

        // --- Visualization 1: Placement Status Overview ---
        const inProcessDeptStudentRegNos = new Set();
        deptStudents.forEach(s => {
            if (placedDeptStudentRegNos.has(s.registerNumber)) return;
            const isRegisteredAndActive = deptRecruitments.some(a => {
                const regs = a.registrations || a.registeredStudents || [];
                if (!regs.includes(s.registerNumber)) return false;
                const evalRes = db.evaluateStudentPhases(a, s.registerNumber);
                return !evalRes.isEliminated && !evalRes.isPlaced;
            });
            if (isRegisteredAndActive) {
                inProcessDeptStudentRegNos.add(s.registerNumber);
            }
        });

        const inProcessCount = inProcessDeptStudentRegNos.size;
        const unplacedCount = Math.max(0, totalStudents - placedCount - inProcessCount);

        const pTotalEl = document.getElementById('dashPlacementTotalText');
        if (pTotalEl) pTotalEl.textContent = `Total: ${totalStudents}`;
        const pPercentEl = document.getElementById('placementPercentText');
        const placementPercent = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0;
        if (pPercentEl) pPercentEl.textContent = `${placementPercent}%`;

        const pCtx = document.getElementById('placementStatusChart');
        if (pCtx) {
            if (window.placementStatusChartInst) window.placementStatusChartInst.destroy();
            window.placementStatusChartInst = new Chart(pCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Placed Students', 'In Process', 'Unplaced'],
                    datasets: [{
                        data: [placedCount, inProcessCount, unplacedCount],
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                        borderWidth: 6,
                        borderColor: '#ffffff',
                        cutout: '80%',
                        borderRadius: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } }
                }
            });
        }

        // --- Visualization 2: Training Status Overview ---
        let completedTrainingSet = new Set();
        let attendingTrainingSet = new Set();

        allTrainings.forEach(p => {
            const sessionCount = (p.sessions || []).length;
            if (sessionCount === 0) return;
            const studentAttendance = {};
            p.sessions.forEach(s => {
                (s.attendance || []).forEach(reg => {
                    if (deptStudentRegNos.has(reg)) {
                        studentAttendance[reg] = (studentAttendance[reg] || 0) + 1;
                        attendingTrainingSet.add(reg);
                    }
                });
            });
            Object.entries(studentAttendance).forEach(([reg, count]) => {
                if (count === sessionCount) {
                    completedTrainingSet.add(reg);
                }
            });
        });

        completedTrainingSet.forEach(reg => attendingTrainingSet.delete(reg));
        const completedTrainCount = completedTrainingSet.size;
        const attendingTrainCount = attendingTrainingSet.size;
        const notAttendingCount = Math.max(0, totalStudents - completedTrainCount - attendingTrainCount);

        const tTotalEl = document.getElementById('dashTrainingTotalText');
        if (tTotalEl) tTotalEl.textContent = `Total: ${totalStudents}`;
        const tPercentEl = document.getElementById('trainingPercentText');
        const trainingPercent = totalStudents > 0 ? Math.round((completedTrainCount / totalStudents) * 100) : 0;
        if (tPercentEl) tPercentEl.textContent = `${trainingPercent}%`;

        const tCtx = document.getElementById('trainingStatusChart');
        if (tCtx) {
            if (window.trainingStatusChartInst) window.trainingStatusChartInst.destroy();
            window.trainingStatusChartInst = new Chart(tCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Attending Trainings', 'Completed Trainings', 'Not Attending'],
                    datasets: [{
                        data: [attendingTrainCount, completedTrainCount, notAttendingCount],
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                        borderWidth: 6,
                        borderColor: '#ffffff',
                        cutout: '80%',
                        borderRadius: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } }
                }
            });
        }

        // --- Visualization 4: Placed Students Overview & Table ---
        function renderDashboardPlacedTable() {
            const tableBody = document.querySelector('#dashboardPlacedTable tbody');
            if (!tableBody) return;

            const courseFilter = document.getElementById('dashFilterCourse')?.value || '';
            let filteredStudents = placedDeptStudents;
            if (courseFilter) {
                filteredStudents = filteredStudents.filter(s => s.course === courseFilter);
            }

            const studentActivitiesCount = {};
            const studentRecruitmentsCount = {};

            allActivities.forEach(a => {
                (a.registrations || a.registeredStudents || []).forEach(reg => {
                    if (a.type === 'recruitment') {
                        studentRecruitmentsCount[reg] = (studentRecruitmentsCount[reg] || 0) + 1;
                    } else {
                        studentActivitiesCount[reg] = (studentActivitiesCount[reg] || 0) + 1;
                    }
                });
            });

            tableBody.innerHTML = '';
            if (filteredStudents.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No placed students found for your department.</td></tr>';
            } else {
                filteredStudents.forEach(s => {
                    const tr = document.createElement('tr');
                    const placedDrives = db.getStudentPlacementDetails(s.registerNumber);
                    const placedText = placedDrives.length > 0 ? placedDrives.join(', ') : 'Placed';
                    tr.innerHTML = `
                        <td><strong>${s.name}</strong></td>
                        <td>${s.course || '—'}</td>
                        <td><span class="badge bg-primary" style="font-size: 11px;">${studentActivitiesCount[s.registerNumber] || 0}</span></td>
                        <td><span class="badge bg-secondary" style="font-size: 11px;">${studentRecruitmentsCount[s.registerNumber] || 0}</span></td>
                        <td><span class="badge bg-success" style="font-size: 11px;">${placedText}</span></td>
                    `;
                    tableBody.appendChild(tr);
                });
            }

            // --- Course & Gender Chart (Scoped to Placed Dept Students) ---
            const courseGenderStats = {};
            Array.from(deptCourses).sort().forEach(c => {
                courseGenderStats[c] = { male: 0, female: 0, other: 0 };
            });

            placedDeptStudents.forEach(s => {
                const c = s.course || 'Unknown';
                const g = (s.gender || 'Other').toLowerCase();
                if (!courseGenderStats[c]) courseGenderStats[c] = { male: 0, female: 0, other: 0 };
                if (g === 'male') courseGenderStats[c].male++;
                else if (g === 'female') courseGenderStats[c].female++;
                else courseGenderStats[c].other++;
            });

            const labels = Object.keys(courseGenderStats);
            const maleData = labels.map(c => courseGenderStats[c].male);
            const femaleData = labels.map(c => courseGenderStats[c].female);
            const otherData = labels.map(c => courseGenderStats[c].other);

            const cgCtx = document.getElementById('courseGenderChart');
            if (cgCtx) {
                if (window.courseGenderChartInst) window.courseGenderChartInst.destroy();
                window.courseGenderChartInst = new Chart(cgCtx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            { label: 'Male', data: maleData, backgroundColor: '#3b82f6', borderRadius: 4 },
                            { label: 'Female', data: femaleData, backgroundColor: '#ec4899', borderRadius: 4 },
                            { label: 'Other', data: otherData, backgroundColor: '#f59e0b', borderRadius: 4 }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            tooltip: { mode: 'index', intersect: false }
                        },
                        scales: {
                            x: { stacked: false, grid: { display: false } },
                            y: { stacked: false, beginAtZero: true, ticks: { stepSize: 1 } }
                        }
                    }
                });
            }
        }

        // Setup Course Filter Dropdown with only teacher's department courses
        const dashCourseSelect = document.getElementById('dashFilterCourse');
        if (dashCourseSelect) {
            const currentSel = dashCourseSelect.value;
            dashCourseSelect.innerHTML = '<option value="">All Courses</option>';
            Array.from(deptCourses).sort().forEach(c => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                if (c === currentSel) opt.selected = true;
                dashCourseSelect.appendChild(opt);
            });
            dashCourseSelect.onchange = renderDashboardPlacedTable;
        }
        renderDashboardPlacedTable();

        // --- Visualization 3: Activity Course-wise Attendance ---
        const dashActivitySelect = document.getElementById('dashFilterActivity');
        if (dashActivitySelect) {
            const currentVal = dashActivitySelect.value;
            dashActivitySelect.innerHTML = '<option value="">Select Activity</option>';
            allActivities.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = a.name;
                if (a.id === currentVal) opt.selected = true;
                dashActivitySelect.appendChild(opt);
            });

            if (!dashActivitySelect.value && allActivities.length > 0) {
                dashActivitySelect.value = allActivities[0].id;
            }
            dashActivitySelect.onchange = renderActivityAttendanceChart;
        }

        function renderActivityAttendanceChart() {
            const actId = dashActivitySelect ? dashActivitySelect.value : null;
            let labels = Array.from(deptCourses).sort();
            let data = labels.map(() => 0);

            const selectedAct = allActivities.find(a => a.id === actId);
            if (selectedAct && Array.isArray(selectedAct.registrations) && selectedAct.registrations.length > 0) {
                const courseCounts = {};
                labels.forEach(c => { courseCounts[c] = 0; });
                selectedAct.registrations.forEach(reg => {
                    const student = deptStudents.find(s => s.registerNumber === reg);
                    if (student && student.course) {
                        courseCounts[student.course] = (courseCounts[student.course] || 0) + 1;
                    }
                });
                data = labels.map(c => courseCounts[c] || 0);
            }

            const ctx = document.getElementById('activityAttendanceChart');
            if (ctx) {
                if (window.activityAttendanceChartInst) window.activityAttendanceChartInst.destroy();
                window.activityAttendanceChartInst = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Registered / Attended Students',
                            data: data,
                            backgroundColor: '#10b981',
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } }
                    }
                });
            }
        }
        renderActivityAttendanceChart();
    }

    // --- Program Calendar Logic (Replicating Admin Calendar with Dept Scope) ---
    const programColors = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#2563eb'];
    function getEventColor(id) {
        let hash = 0;
        for (let i = 0; i < (id || '').length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
        return programColors[Math.abs(hash) % programColors.length];
    }

    function renderProgramCalendar() {
        const monthSelect = document.getElementById('calMonth');
        const yearSelect = document.getElementById('calYear');
        const container = document.getElementById('calendarContainer');

        if (!monthSelect || !yearSelect || !container) return;

        const allTrainings = (db.getTrainingPrograms() || []).filter(isItemForDept);
        const allActivities = (db.getPlacementActivities() || []).filter(isItemForDept);

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (monthSelect.options.length === 0) {
            months.forEach((m, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = m;
                monthSelect.appendChild(opt);
            });
            const currentYear = new Date().getFullYear();
            for (let y = currentYear - 1; y <= currentYear + 2; y++) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                yearSelect.appendChild(opt);
            }
            const today = new Date();
            monthSelect.value = today.getMonth();
            yearSelect.value = today.getFullYear();

            monthSelect.addEventListener('change', drawCalendar);
            yearSelect.addEventListener('change', drawCalendar);
        }

        function drawCalendar() {
            const month = parseInt(monthSelect.value);
            const year = parseInt(yearSelect.value);
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:#e5e7eb;border:1px solid #e5e7eb;">';
            
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayNames.forEach(d => {
                html += `<div style="background:#f9fafb;padding:10px;text-align:center;font-weight:600;font-size:12px;color:#6b7280;">${d}</div>`;
            });

            for (let i = 0; i < firstDay; i++) {
                html += `<div style="background:#fff;min-height:100px;"></div>`;
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                // Collect programs/events matching this day
                const dayTrainings = allTrainings.filter(p => {
                    const start = p.startDate || p.date;
                    const end = p.endDate || p.date || p.startDate;
                    return dateStr >= start && dateStr <= end;
                });

                const dayActivities = allActivities.filter(p => {
                    const start = p.startDate || p.date;
                    const end = p.endDate || p.lastDate || p.date || p.startDate;
                    return dateStr >= start && dateStr <= end;
                });

                let eventsHtml = '';
                dayTrainings.forEach(p => {
                    const color = getEventColor(p.id);
                    eventsHtml += `<div style="background:#eef2ff;color:${color};font-size:10px;font-weight:600;padding:2px 4px;border-radius:4px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:2px solid ${color};" title="${p.name}">📚 ${p.name}</div>`;
                });
                dayActivities.forEach(p => {
                    const color = p.type === 'recruitment' ? '#059669' : '#0D6EFC';
                    eventsHtml += `<div style="background:${p.type === 'recruitment' ? '#ecfdf5' : '#eff6ff'};color:${color};font-size:10px;font-weight:600;padding:2px 4px;border-radius:4px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:2px solid ${color};" title="${p.name}">💼 ${p.name}</div>`;
                });

                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                const bg = isToday ? '#eff6ff' : '#fff';
                
                html += `<div style="background:${bg};min-height:100px;padding:8px;display:flex;flex-direction:column;cursor:pointer;transition:background 0.2s;" onclick="viewTeacherDateEvents('${dateStr}')" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='${bg}'">
                    <div style="text-align:right;font-size:12px;color:${isToday ? '#2563eb' : '#374151'};font-weight:${isToday ? '700' : '500'};margin-bottom:4px;">${day}</div>
                    <div style="flex:1;">${eventsHtml}</div>
                </div>`;
            }

            const totalCells = firstDay + daysInMonth;
            const remaining = (7 - (totalCells % 7)) % 7;
            for (let i = 0; i < remaining; i++) {
                html += `<div style="background:#fff;min-height:100px;"></div>`;
            }

            html += '</div>';
            container.innerHTML = html;
        }

        drawCalendar();
    }

    window.viewTeacherDateEvents = function(dateStr) {
        const header = document.getElementById('calSelectedDateHeader');
        const list = document.getElementById('calSelectedEventsList');
        if (!header || !list) return;

        const allTrainings = (db.getTrainingPrograms() || []).filter(isItemForDept);
        const allActivities = (db.getPlacementActivities() || []).filter(isItemForDept);

        const dateObj = new Date(dateStr);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        header.textContent = `Programs on ${formattedDate}`;

        const dayTrainings = allTrainings.filter(p => {
            const start = p.startDate || p.date;
            const end = p.endDate || p.date || p.startDate;
            return dateStr >= start && dateStr <= end;
        });

        const dayActivities = allActivities.filter(p => {
            const start = p.startDate || p.date;
            const end = p.endDate || p.lastDate || p.date || p.startDate;
            return dateStr >= start && dateStr <= end;
        });

        if (dayTrainings.length === 0 && dayActivities.length === 0) {
            list.innerHTML = `<p class="text-muted small">No events scheduled for your department on this day.</p>`;
        } else {
            let html = '';
            dayTrainings.forEach(p => {
                const color = getEventColor(p.id);
                html += `
                    <div style="background: #fff; border-left: 4px solid ${color}; border-radius: 6px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 8px;">
                        <div style="font-size: 0.72rem; font-weight: 700; color: ${color}; text-transform: uppercase; margin-bottom: 4px;">Training Program</div>
                        <h5 style="margin: 0 0 4px 0; font-size: 0.95rem; font-weight: 700; color: #111827;">${p.name}</h5>
                        ${p.description ? `<div style="margin: 0 0 6px 0; font-size: 0.8rem; color: #4b5563; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</div>` : ''}
                        <div style="font-size: 0.75rem; color: #6b7280;">📅 ${p.date || p.startDate || '—'} ${p.endDate ? `to ${p.endDate}` : ''}</div>
                    </div>
                `;
            });
            dayActivities.forEach(p => {
                const color = p.type === 'recruitment' ? '#059669' : '#0D6EFC';
                html += `
                    <div style="background: #fff; border-left: 4px solid ${color}; border-radius: 6px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 8px;">
                        <div style="font-size: 0.72rem; font-weight: 700; color: ${color}; text-transform: uppercase; margin-bottom: 4px;">${p.type === 'recruitment' ? 'Recruitment Drive' : 'Placement Activity'}</div>
                        <h5 style="margin: 0 0 4px 0; font-size: 0.95rem; font-weight: 700; color: #111827;">${p.name}</h5>
                        ${p.description ? `<div style="margin: 0 0 6px 0; font-size: 0.8rem; color: #4b5563; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</div>` : ''}
                        <div style="font-size: 0.75rem; color: #6b7280;">📍 ${p.venue || 'Christ Campus'} | 📅 ${p.date || p.startDate || '—'}</div>
                    </div>
                `;
            });
            list.innerHTML = html;
        }

        // Smooth scroll on smaller devices
        const rightPanel = document.getElementById('calendarRightPanelWrapper');
        const calContainer = document.getElementById('calendarContainer');
        if (rightPanel && calContainer) {
            const isMobile = window.innerWidth <= 992 || rightPanel.getBoundingClientRect().top > calContainer.getBoundingClientRect().top + 50;
            if (isMobile) {
                requestAnimationFrame(() => {
                    rightPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
        }
    };

    // Initial render
    renderTeacherDashboard();
    renderProgramCalendar();

    // Route UI after DB is ready
    try {
        handleRouting(false);
    } catch (error) {
        console.error("Teacher portal routing initialization failed:", error);
    }
});
