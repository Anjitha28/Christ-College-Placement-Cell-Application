// permissions.js
// Defines the role-based capabilities matrix and helper checks

const Permissions = {
    matrix: {
        admin: {
            manage_users: true,
            edit_people: true,
            edit_teachers: true,
            bulk_upload: true,
            edit_training_drives: true,
            manage_sessions: true,
            update_phase_results: true,
            post_announcements: true,
            view_analytics: true,
            view_reports: true,
            system_settings: true
        },
        placementCoordinatorEdit: {
            manage_users: false,
            edit_people: false,
            edit_teachers: false,
            bulk_upload: false,
            edit_training_drives: true,
            manage_sessions: true,
            update_phase_results: true,
            post_announcements: true,
            view_analytics: true,
            view_reports: true,
            system_settings: false
        },
        placementCoordinatorRead: {
            manage_users: false,
            edit_people: false,
            edit_teachers: false,
            bulk_upload: false,
            edit_training_drives: false,
            manage_sessions: false,
            update_phase_results: false,
            post_announcements: false,
            view_analytics: true,
            view_reports: true,
            system_settings: false
        },
        teacherCoordinator: {
            manage_users: false,
            edit_people: false,
            edit_teachers: false,
            bulk_upload: false,
            edit_training_drives: false,
            manage_sessions: false,
            update_phase_results: false,
            post_announcements: true,
            view_analytics: true,
            view_reports: true,
            system_settings: false
        },
        studentCoordinator: {
            manage_users: false,
            edit_people: false,
            edit_teachers: false,
            bulk_upload: false,
            edit_training_drives: false,
            manage_sessions: false,
            update_phase_results: false,
            post_announcements: true,
            view_analytics: true,
            view_reports: true,
            system_settings: false
        },
        student: {
            manage_users: false,
            edit_people: false,
            bulk_upload: false,
            edit_training_drives: false,
            manage_sessions: false,
            update_phase_results: false,
            post_announcements: false,
            view_analytics: false,
            view_reports: false,
            system_settings: false
        }
    },

    can(role, capability) {
        if (!role) return false;
        
        // Dynamic permission check for placement coordinator
        if (role === 'studentCoordinator' || role === 'teacherCoordinator' || role === 'placementCoordinator') {
            let perm = 'read';
            try {
                const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
                perm = user.coordinatorPermission || (role === 'teacherCoordinator' ? 'edit' : 'read');
                if (!user.coordinatorPermission) {
                    const map = JSON.parse(localStorage.getItem('coordinator_permissions') || '{}');
                    const uid = user.registerNumber || user.phoneNumber || user.id;
                    if (uid && map[uid]) perm = map[uid];
                }
            } catch (e) {}

            const activeRole = perm === 'edit' ? 'placementCoordinatorEdit' : 'placementCoordinatorRead';
            return !!(this.matrix[activeRole] && this.matrix[activeRole][capability]);
        }

        if (!this.matrix[role]) return false;
        return !!this.matrix[role][capability];
    }
};
