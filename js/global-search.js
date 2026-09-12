/**
 * global-search.js
 * Intelligent, function-based Universal Global Search Bar across all portals:
 * - Admin Portal (admin.html)
 * - Coordinator Portal (coordinator.html)
 * - Teacher Portal (teacher.html)
 * - Student Portal (student.html)
 *
 * Provides real-time categorized results, keyboard navigation, permission scoping,
 * automatic section navigation, local filtering, and record pulse-highlighting.
 */

(function () {
    'use strict';

    // State
    let searchInput = null;
    let clearBtn = null;
    let dropdown = null;
    let resultsContainer = null;
    let selectedIndex = -1;
    let currentResults = [];
    let portal = 'admin';
    let currentUser = null;
    let userRole = 'admin';

    // Detect Portal Environment
    function detectPortal() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('teacher.html')) return 'teacher';
        if (path.includes('student.html')) return 'student';
        if (path.includes('coordinator.html')) return 'coordinator';
        return 'admin';
    }

    // Initialize Global Search Engine
    async function initGlobalSearch() {
        portal = detectPortal();
        try {
            currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
            userRole = sessionStorage.getItem('userRole') || (portal === 'student' ? 'student' : (portal === 'teacher' ? 'teacher' : 'admin'));
        } catch (e) {
            currentUser = {};
        }

        // Wait for database ready
        if (window.db && window.db.ready) {
            try {
                await window.db.ready;
            } catch (e) {
                console.warn('GlobalSearch: DB ready wait error:', e);
            }
        }

        setupSearchDOM();
        bindEvents();
    }

    // Set up or wrap the Search Bar DOM
    function setupSearchDOM() {
        // Find existing header-search-wrapper or create/enhance it
        let wrapper = document.querySelector('.header-search-wrapper');
        if (!wrapper) {
            console.warn('GlobalSearch: .header-search-wrapper not found in DOM.');
            return;
        }

        // Standardize input
        searchInput = wrapper.querySelector('.header-search-input');
        if (!searchInput) {
            searchInput = document.createElement('input');
            searchInput.type = 'search';
            searchInput.className = 'header-search-input';
            wrapper.appendChild(searchInput);
        }

        // Configure attributes
        searchInput.id = 'globalPortalSearchInput';
        searchInput.name = 'global_portal_search';
        searchInput.placeholder = 'Search students, training, exams, placements...';
        searchInput.setAttribute('autocomplete', 'off');
        searchInput.setAttribute('autocorrect', 'off');
        searchInput.setAttribute('spellcheck', 'false');
        searchInput.setAttribute('data-lpignore', 'true');
        searchInput.setAttribute('data-form-type', 'other');

        // Clear existing value on initial load to prevent browser autofill
        searchInput.value = '';

        // Add or reuse Clear Button
        clearBtn = wrapper.querySelector('.header-search-clear');
        if (!clearBtn) {
            clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'header-search-clear hidden';
            clearBtn.id = 'globalSearchClearBtn';
            clearBtn.setAttribute('aria-label', 'Clear search');
            clearBtn.innerHTML = '✕';
            wrapper.appendChild(clearBtn);
        }

        // Add or reuse Dropdown Container
        dropdown = wrapper.querySelector('.global-search-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'global-search-dropdown hidden';
            dropdown.id = 'globalSearchDropdown';
            dropdown.innerHTML = `
                <div class="global-search-results" id="globalSearchResults"></div>
                <div class="global-search-footer">
                    <span class="search-tip"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                    <span class="search-tip"><kbd>↵</kbd> select</span>
                    <span class="search-tip"><kbd>esc</kbd> close</span>
                </div>
            `;
            wrapper.appendChild(dropdown);
        }
        resultsContainer = dropdown.querySelector('.global-search-results');
    }

    // Bind Event Listeners
    function bindEvents() {
        if (!searchInput) return;

        // Input listener with debounce
        let debounceTimer = null;
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (clearBtn) clearBtn.classList.toggle('hidden', query.length === 0);
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                executeSearch(query);
            }, 120);
        });

        // Focus listener to show recent/current search if text exists
        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                executeSearch(query);
            }
        });

        // Clear button
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearSearch(true);
            });
        }

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (dropdown && !dropdown.classList.contains('hidden')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    navigateKeyboard(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    navigateKeyboard(-1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedIndex >= 0 && currentResults[selectedIndex]) {
                        selectResult(currentResults[selectedIndex]);
                    } else if (currentResults.length > 0) {
                        selectResult(currentResults[0]);
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeDropdown();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) executeSearch(query, true);
            }
        });

        // Click outside listener to dismiss dropdown
        document.addEventListener('click', (e) => {
            const wrapper = document.querySelector('.header-search-wrapper');
            if (wrapper && !wrapper.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    function clearSearch(restoreCurrentSection = false) {
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        if (clearBtn) clearBtn.classList.add('hidden');
        closeDropdown();

        if (restoreCurrentSection) {
            // Clear current active section filter if applicable
            resetActiveSectionFilter();
        }
    }

    function closeDropdown() {
        if (dropdown) dropdown.classList.add('hidden');
        selectedIndex = -1;
    }

    function openDropdown() {
        if (dropdown) dropdown.classList.remove('hidden');
    }

    // Keyboard navigation highlight
    function navigateKeyboard(direction) {
        const items = resultsContainer.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        items.forEach(el => el.classList.remove('selected'));
        selectedIndex += direction;

        if (selectedIndex >= items.length) selectedIndex = 0;
        if (selectedIndex < 0) selectedIndex = items.length - 1;

        const target = items[selectedIndex];
        if (target) {
            target.classList.add('selected');
            target.scrollIntoView({ block: 'nearest' });
        }
    }

    // Execute Real-Time Search Query across Portal Data
    function executeSearch(query, selectTopOnEnter = false) {
        if (!query || query.length === 0) {
            closeDropdown();
            return;
        }

        const normalizedQuery = query.toLowerCase();
        const results = gatherAndScoreResults(normalizedQuery);
        currentResults = results;

        if (selectTopOnEnter && results.length > 0) {
            selectResult(results[0]);
            return;
        }

        renderSearchResults(query, results);
    }

    // Gather and score real data from existing DB cache
    function gatherAndScoreResults(query) {
        if (!window.db) return [];

        let candidates = [];
        const tDept = currentUser.department || '';
        const sReg = currentUser.registerNumber || '';

        // Helper scorer
        const calculateScore = (exactMatchField, prefixMatchField, otherFields = []) => {
            const exact = (exactMatchField || '').toLowerCase().trim();
            const prefix = (prefixMatchField || '').toLowerCase().trim();
            if (exact === query) return 100;
            if (prefix === query) return 95;
            if (exact.startsWith(query)) return 80;
            if (prefix.startsWith(query)) return 75;
            if (exact.includes(query)) return 60;
            if (prefix.includes(query)) return 50;

            for (const f of otherFields) {
                const val = (f || '').toLowerCase().trim();
                if (val === query) return 45;
                if (val.startsWith(query)) return 35;
                if (val.includes(query)) return 25;
            }
            return 0;
        };

        // --- 1. ADMIN & COORDINATOR SEARCH DATA ---
        if (portal === 'admin' || portal === 'coordinator') {
            // Students
            const students = window.db.getStudents() || [];
            students.forEach(s => {
                const score = calculateScore(s.name, s.registerNumber, [s.mailId, s.phoneNumber, s.course, s.department]);
                if (score > 0) {
                    candidates.push({
                        category: 'Students',
                        iconClass: 'search-icon-students',
                        icon: '🎓',
                        title: s.name,
                        meta: `${s.registerNumber} • ${s.course || ''} (${s.department || ''})`,
                        badge: s.department || 'Student',
                        score: score + 10,
                        action: {
                            tab: 'userManagement',
                            subtab: 'studentsSubTab',
                            inputSelector: '#searchStudent',
                            filterValue: s.registerNumber,
                            targetIdentifier: s.registerNumber,
                            hint: 'Open Student'
                        }
                    });
                }
            });

            // Teachers
            const teachers = window.db.getTeachers() || [];
            teachers.forEach(t => {
                const score = calculateScore(t.name, t.phoneNumber, [t.mailId, t.department]);
                if (score > 0) {
                    candidates.push({
                        category: 'Teachers',
                        iconClass: 'search-icon-teachers',
                        icon: '👨‍🏫',
                        title: t.name,
                        meta: `${t.department || ''} • ${t.mailId || ''} • ${t.phoneNumber || ''}`,
                        badge: t.department || 'Faculty',
                        score: score + 5,
                        action: {
                            tab: 'userManagement',
                            subtab: 'teachersSubTab',
                            inputSelector: '#searchTeacher',
                            filterValue: t.name,
                            targetIdentifier: t.phoneNumber || t.name,
                            hint: 'Open Faculty'
                        }
                    });
                }
            });

            // Training Programs
            const trainings = window.db.getTrainingPrograms() || [];
            trainings.forEach(p => {
                const score = calculateScore(p.name, p.venue, [p.date, p.description, 'training', 'program', 'workshop']);
                if (score > 0) {
                    candidates.push({
                        category: 'Training Programs',
                        iconClass: 'search-icon-training',
                        icon: '📚',
                        title: p.name,
                        meta: `${p.venue ? p.venue + ' • ' : ''}Date: ${p.date || 'TBD'}`,
                        badge: 'Training',
                        score: score + 8,
                        action: {
                            tab: 'training',
                            inputSelector: '#searchTraining',
                            filterValue: p.name,
                            targetIdentifier: p.id || p.name,
                            hint: 'View Training'
                        }
                    });
                }
            });

            // MCQ Exams
            const exams = window.db.getExams() || [];
            exams.forEach(e => {
                const score = calculateScore(e.title, e.subject, [e.date, 'exam', 'mcq', 'test', 'quiz', 'assessment']);
                if (score > 0) {
                    candidates.push({
                        category: 'MCQ Exams',
                        iconClass: 'search-icon-mcq',
                        icon: '📝',
                        title: e.title,
                        meta: `${e.subject ? e.subject + ' • ' : ''}Duration: ${e.durationMinutes || 30}m`,
                        badge: 'MCQ Exam',
                        score: score + 6,
                        action: {
                            tab: 'mcq',
                            inputSelector: '#searchExam',
                            filterValue: e.title,
                            targetIdentifier: e.id || e.title,
                            hint: 'View Exam'
                        }
                    });
                }
            });

            // Placement Activities & Recruitments
            const activities = window.db.getPlacementActivities() || [];
            activities.forEach(a => {
                const isRec = a.type === 'recruitment';
                const score = calculateScore(a.name, a.venue, [a.date, a.description, isRec ? 'recruitment' : 'placement', 'drive', 'interview', 'job']);
                if (score > 0) {
                    candidates.push({
                        category: isRec ? 'Recruitment Drives' : 'Placement Activities',
                        iconClass: isRec ? 'search-icon-recruitment' : 'search-icon-placement',
                        icon: isRec ? '💼' : '🎯',
                        title: a.name,
                        meta: `${isRec && a.venue ? a.venue + ' • ' : ''}Due: ${a.date || 'Upcoming'}`,
                        badge: isRec ? 'Recruitment' : 'Activity',
                        score: score + 9,
                        action: {
                            tab: 'placement',
                            subtab: isRec ? 'recruitmentSubTab' : 'activitySubTab',
                            inputSelector: isRec ? '#recSearchStudent' : '#actSearchStudent',
                            filterValue: a.name,
                            targetIdentifier: a.id || a.name,
                            hint: isRec ? 'View Drive' : 'View Activity'
                        }
                    });
                }
            });

            // Classes & Incharges
            const incharges = window.db.getClassIncharges() || [];
            incharges.forEach(c => {
                const score = calculateScore(c.course, c.department, [c.inchargeName, c.inchargeMail]);
                if (score > 0) {
                    candidates.push({
                        category: 'Classes & Incharges',
                        iconClass: 'search-icon-classes',
                        icon: '🏛️',
                        title: `${c.course} (${c.department})`,
                        meta: `Incharge: ${c.inchargeName || 'Not Assigned'} • ${c.inchargeMail || ''}`,
                        badge: 'Class',
                        score: score + 2,
                        action: {
                            tab: 'classView',
                            inputSelector: '#classSearchInput',
                            filterValue: c.course,
                            targetIdentifier: c.course,
                            hint: 'View Class'
                        }
                    });
                }
            });
        }

        // --- 2. TEACHER PORTAL SEARCH DATA (Department Scoped) ---
        else if (portal === 'teacher') {
            // Students restricted to teacher's department
            const students = (window.db.getStudents() || []).filter(s => !tDept || s.department === tDept);
            students.forEach(s => {
                const score = calculateScore(s.name, s.registerNumber, [s.mailId, s.course, s.phoneNumber]);
                if (score > 0) {
                    candidates.push({
                        category: `${tDept || 'Department'} Students`,
                        iconClass: 'search-icon-students',
                        icon: '🎓',
                        title: s.name,
                        meta: `${s.registerNumber} • ${s.course || ''}`,
                        badge: s.course || 'Student',
                        score: score + 10,
                        action: {
                            tab: 'dashboard',
                            customHandler: () => {
                                // Filter placed table if on dashboard
                                const rows = document.querySelectorAll('#dashboardPlacedTable tbody tr');
                                rows.forEach(r => {
                                    const match = r.textContent.toLowerCase().includes(s.name.toLowerCase()) || r.textContent.toLowerCase().includes(s.registerNumber.toLowerCase());
                                    r.style.display = match ? '' : 'none';
                                    if (match) highlightElement(r);
                                });
                            },
                            hint: 'View Student'
                        }
                    });
                }
            });

            // Trainings available for teacher's dept
            const trainings = (window.db.getTrainingPrograms() || []).filter(p => {
                if (!tDept) return true;
                if (!p.target || p.target.type === 'all') return true;
                if (p.target.type === 'dept') return (p.target.depts || []).includes(tDept);
                return true;
            });
            trainings.forEach(p => {
                const score = calculateScore(p.name, p.venue, [p.date]);
                if (score > 0) {
                    candidates.push({
                        category: 'Department Training Programs',
                        iconClass: 'search-icon-training',
                        icon: '📚',
                        title: p.name,
                        meta: `${p.venue ? p.venue + ' • ' : ''}Date: ${p.date || 'TBD'}`,
                        badge: 'Training',
                        score: score + 8,
                        action: {
                            tab: 'calendar',
                            hint: 'View in Calendar'
                        }
                    });
                }
            });

            // Placement Activities for teacher's dept
            const activities = (window.db.getPlacementActivities() || []).filter(a => {
                if (!tDept) return true;
                if (!a.target || a.target.type === 'all') return true;
                if (a.target.type === 'dept') return (a.target.depts || []).includes(tDept);
                return true;
            });
            activities.forEach(a => {
                const isRec = a.type === 'recruitment';
                const score = calculateScore(a.name, a.venue, [a.date]);
                if (score > 0) {
                    candidates.push({
                        category: isRec ? 'Recruitment Drives' : 'Placement Activities',
                        iconClass: isRec ? 'search-icon-recruitment' : 'search-icon-placement',
                        icon: isRec ? '💼' : '🎯',
                        title: a.name,
                        meta: `${isRec && a.venue ? a.venue + ' • ' : ''}Due: ${a.date || 'Upcoming'}`,
                        badge: isRec ? 'Recruitment' : 'Activity',
                        score: score + 7,
                        action: {
                            tab: 'dashboard',
                            customHandler: () => {
                                const actSel = document.getElementById('dashFilterActivity');
                                if (actSel) {
                                    actSel.value = a.name;
                                    actSel.dispatchEvent(new Event('change'));
                                    highlightElement(actSel);
                                }
                            },
                            hint: 'View Status'
                        }
                    });
                }
            });
        }

        // --- 3. STUDENT PORTAL SEARCH DATA (Student Scoped) ---
        else if (portal === 'student') {
            const sCourse = currentUser.course || '';
            const sDept = currentUser.department || '';

            // My Profile
            const profileScore = calculateScore(currentUser.name, currentUser.registerNumber, [currentUser.mailId, currentUser.phoneNumber, currentUser.course, currentUser.department]);
            if (profileScore > 0) {
                candidates.push({
                    category: 'Student Profile',
                    iconClass: 'search-icon-profile',
                    icon: '👤',
                    title: currentUser.name || 'My Profile',
                    meta: `${currentUser.registerNumber || ''} • ${currentUser.course || ''} (${currentUser.department || ''})`,
                    badge: 'My Profile',
                    score: profileScore + 15,
                    action: {
                        customHandler: () => {
                            if (typeof window.openStudentProfile === 'function') {
                                window.openStudentProfile();
                            } else {
                                const m = document.getElementById('studentProfileModal');
                                if (m) m.classList.remove('hidden');
                            }
                        },
                        hint: 'Open Profile'
                    }
                });
            }

            // Training Programs (Targeted or Registered)
            const trainings = window.db.getTrainingPrograms() || [];
            trainings.forEach(p => {
                const isReg = (p.registrations || []).includes(sReg);
                const isEligible = !p.target || p.target.type === 'all' || 
                                   (p.target.type === 'course' && (p.target.courses || []).includes(sCourse)) ||
                                   (p.target.type === 'dept' && (p.target.depts || []).includes(sDept));
                if (isReg || isEligible) {
                    const score = calculateScore(p.name, p.venue, [p.date, p.description, 'training', 'program', 'workshop']);
                    if (score > 0) {
                        candidates.push({
                            category: isReg ? 'My Registered Programs' : 'Available Training Programs',
                            iconClass: 'search-icon-training',
                            icon: '📚',
                            title: p.name,
                            meta: `${p.venue ? p.venue + ' • ' : ''}${isReg ? 'Registered' : 'Open for Registration'}`,
                            badge: isReg ? 'Registered' : 'Available',
                            score: score + (isReg ? 10 : 5),
                            action: {
                                tab: 'training',
                                targetIdentifier: p.id || p.name,
                                hint: 'View Training'
                            }
                        });
                    }
                }
            });

            // Placement Activities & Recruitments (Targeted or Registered)
            const activities = window.db.getPlacementActivities() || [];
            activities.forEach(a => {
                const isReg = (a.registrations || []).includes(sReg);
                const isEligible = !a.target || a.target.type === 'all' || 
                                   (a.target.type === 'course' && (a.target.courses || []).includes(sCourse)) ||
                                   (a.target.type === 'dept' && (a.target.depts || []).includes(sDept)) ||
                                   (a.target.type === 'student' && (a.target.students || []).includes(sReg));
                if (isReg || isEligible) {
                    const isRec = a.type === 'recruitment';
                    const score = calculateScore(a.name, a.venue, [a.date, a.description, isRec ? 'recruitment' : 'placement', 'drive', 'interview', 'job']);
                    if (score > 0) {
                        candidates.push({
                            category: isRec ? 'Recruitment Opportunities' : 'Placement Activities',
                            iconClass: isRec ? 'search-icon-recruitment' : 'search-icon-placement',
                            icon: isRec ? '💼' : '🎯',
                            title: a.name,
                            meta: `${isRec && a.venue ? a.venue + ' • ' : ''}Due: ${a.date || 'Upcoming'}`,
                            badge: isReg ? 'Registered' : 'Eligible',
                            score: score + (isReg ? 9 : 4),
                            action: {
                                tab: 'placement',
                                targetIdentifier: a.id || a.name,
                                hint: 'View Drive'
                            }
                        });
                    }
                }
            });

            // MCQ Exams
            const exams = window.db.getExams() || [];
            exams.forEach(e => {
                const score = calculateScore(e.title, e.subject, [e.date, 'exam', 'mcq', 'test', 'quiz']);
                if (score > 0) {
                    candidates.push({
                        category: 'MCQ Exams',
                        iconClass: 'search-icon-mcq',
                        icon: '📝',
                        title: e.title,
                        meta: `${e.subject ? e.subject + ' • ' : ''}Duration: ${e.durationMinutes || 30}m`,
                        badge: 'MCQ Exam',
                        score: score + 6,
                        action: {
                            tab: 'exams',
                            targetIdentifier: e.id || e.title,
                            hint: 'View Exam'
                        }
                    });
                }
            });
        }

        // Sort descending by score
        candidates.sort((a, b) => b.score - a.score);

        // Cap to 12 top relevant results
        return candidates.slice(0, 12);
    }

    // Render Search Results into Dropdown
    function renderSearchResults(query, results) {
        if (!resultsContainer) return;
        selectedIndex = -1;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-empty-state">
                    <div class="search-empty-icon">🔍</div>
                    <div class="search-empty-text">No results found for "${escapeHtml(query)}"</div>
                    <div class="search-empty-subtext">Check your spelling or try a different keyword</div>
                </div>
            `;
            openDropdown();
            return;
        }

        // Group by category while preserving sorted order
        const categories = {};
        results.forEach((item, idx) => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push({ ...item, originalIndex: idx });
        });

        let html = '';
        Object.keys(categories).forEach(cat => {
            const items = categories[cat];
            html += `
                <div class="search-category-header">
                    <span>${escapeHtml(cat)}</span>
                    <span class="search-category-badge">${items.length}</span>
                </div>
            `;
            items.forEach(item => {
                const highlightedTitle = highlightMatch(item.title, query);
                html += `
                    <div class="search-result-item" data-index="${item.originalIndex}">
                        <div class="search-result-icon ${item.iconClass || ''}">${item.icon || '📌'}</div>
                        <div class="search-result-content">
                            <div class="search-result-title">
                                <span>${highlightedTitle}</span>
                                ${item.badge ? `<span class="search-result-badge">${escapeHtml(item.badge)}</span>` : ''}
                            </div>
                            <div class="search-result-meta">${escapeHtml(item.meta || '')}</div>
                        </div>
                        <div class="search-result-action-hint">${escapeHtml(item.action?.hint || 'Navigate')} ➔</div>
                    </div>
                `;
            });
        });

        resultsContainer.innerHTML = html;

        // Attach click listeners to result rows
        const itemEls = resultsContainer.querySelectorAll('.search-result-item');
        itemEls.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(el.getAttribute('data-index'), 10);
                if (currentResults[idx]) {
                    selectResult(currentResults[idx]);
                }
            });
        });

        openDropdown();
    }

    // Handle Selection of a Result -> Automatic Navigation & Filtering
    function selectResult(item) {
        if (!item || !item.action) return;
        closeDropdown();

        if (searchInput) {
            searchInput.value = item.title;
            if (clearBtn) clearBtn.classList.remove('hidden');
        }

        // 1. Custom handler takes highest priority (e.g. Profile modal)
        if (typeof item.action.customHandler === 'function') {
            item.action.customHandler();
            return;
        }

        const targetTab = item.action.tab;
        if (!targetTab) return;

        // 2. Switch Portal Tab (seamless routing)
        navigateToTab(targetTab);

        // 3. Switch Subtab if applicable
        if (item.action.subtab) {
            setTimeout(() => {
                activateSubtab(item.action.subtab);
            }, 50);
        }

        // 4. Fill and trigger destination section local search filter
        setTimeout(() => {
            if (item.action.inputSelector) {
                const localInput = document.querySelector(item.action.inputSelector);
                if (localInput) {
                    localInput.value = item.action.filterValue || item.title;
                    localInput.dispatchEvent(new Event('input', { bubbles: true }));
                    localInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // 5. Find and pulse-highlight matching row or card
            highlightMatchedRecord(item);
        }, 150);
    }

    // Seamless Tab Navigation across portals
    function navigateToTab(tabId) {
        // Look for sidebar tab link
        const tabLink = document.querySelector(`.tab[data-tab="${tabId}"], .sidebar-link[data-tab="${tabId}"]`);
        
        // Try calling window.activateTab if available
        if (typeof window.activateTab === 'function') {
            window.activateTab(tabId, false);
        } else if (tabLink) {
            tabLink.click();
        } else {
            // Hash fallback
            window.location.hash = tabId;
        }
    }

    // Switch Subtabs (e.g., in User Management or Placement Activities)
    function activateSubtab(subtabId) {
        // Tab button with data-subtab attribute
        const subtabBtn = document.querySelector(`.sub-tab[data-subtab="${subtabId}"], .p-sub-tab[data-subtab="${subtabId}"]`);
        if (subtabBtn) {
            subtabBtn.click();
            return;
        }

        // Direct container switch fallback
        const subContent = document.getElementById(subtabId);
        if (subContent) {
            document.querySelectorAll('.sub-tab-content, .p-sub-content').forEach(el => el.classList.add('hidden'));
            subContent.classList.remove('hidden');
        }
    }

    // Highlight destination element
    function highlightMatchedRecord(item) {
        const identifier = (item.action.targetIdentifier || item.title).toLowerCase();
        
        // Check rows in tables or cards
        const candidates = document.querySelectorAll('tbody tr, .glass-card, .phase-card-item, .training-card');
        for (const el of candidates) {
            if (el.textContent.toLowerCase().includes(identifier)) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                highlightElement(el);
                break;
            }
        }
    }

    function highlightElement(el) {
        if (!el) return;
        el.classList.remove('search-target-highlight');
        void el.offsetWidth; // Force reflow
        el.classList.add('search-target-highlight');
        setTimeout(() => {
            el.classList.remove('search-target-highlight');
        }, 2600);
    }

    function resetActiveSectionFilter() {
        const activeTab = document.querySelector('.tab-content.active, .tab-content:not(.hidden)');
        if (!activeTab) return;

        // Find any search inputs inside active tab and clear them
        const localInputs = activeTab.querySelectorAll('input[type="search"], input[type="text"][id*="Search"]');
        localInputs.forEach(input => {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    // Helper: Highlight matching substring
    function highlightMatch(text, query) {
        if (!text || !query) return escapeHtml(text || '');
        const escaped = escapeHtml(text);
        const idx = escaped.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return escaped;
        const before = escaped.substring(0, idx);
        const match = escaped.substring(idx, idx + query.length);
        const after = escaped.substring(idx + query.length);
        return `${before}<span class="search-matched-text">${match}</span>${after}`;
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Expose API for external portals or tests
    window.GlobalPortalSearch = {
        init: initGlobalSearch,
        execute: executeSearch,
        clear: clearSearch,
        selectResult: selectResult
    };

    // Auto-run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalSearch);
    } else {
        initGlobalSearch();
    }
})();
