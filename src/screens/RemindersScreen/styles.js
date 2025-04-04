import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

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
        paddingTop: Constants.statusBarHeight,
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
        borderRadius: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    reminderContent: {
        padding: 16,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    reminderTime: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    reminderDate: {
        fontSize: 14,
        color: '#666',
    },
    reminderText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginVertical: 12,
    },
    importanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#5b6af5',
    },
    importanceText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    highImportanceBadge: {
        backgroundColor: '#ff6b6b',
    },
    mediumImportanceBadge: {
        backgroundColor: '#5b6af5',
    },
    lowImportanceBadge: {
        backgroundColor: '#4CAF50',
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
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginTop: 12,
    },
    completeButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    completedStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e8f5e9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginTop: 12,
    },
    completedText: {
        color: '#4CAF50',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    completedReminder: {
        opacity: 0.8,
        backgroundColor: '#fafafa',
    },
}); 