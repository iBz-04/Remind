import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    remindersList: {
        padding: 16,
    },
    reminderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 3,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reminderTime: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    reminderDate: {
        fontSize: 14,
        color: '#666',
    },
    reminderText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    highImportance: {
        borderLeftColor: '#ff6b6b',
    },
    mediumImportance: {
        borderLeftColor: '#5b6af5',
    },
    lowImportance: {
        borderLeftColor: '#4CAF50',
    },
    importanceLabel: {
        fontSize: 12,
        fontWeight: '500',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        color: '#666',
    },
    reminderTimeContainer: {
        flex: 1,
    },
    headerLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 300,
        backgroundColor: '#fff',
        zIndex: 1000,
    },
    sidebarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sidebarTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#5b6af5',
    },
    sidebarContent: {
        flex: 1,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sidebarItemText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#444',
        fontWeight: '500',
    },
    sidebarFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    logoutMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff5f5',
        padding: 12,
        borderRadius: 12,
    },
    logoutText: {
        fontSize: 16,
        color: '#ff6b6b',
        marginLeft: 12,
        fontWeight: '500',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 32,
        height: 32,
        marginRight: 12,
        borderRadius: 8,
    },
}); 