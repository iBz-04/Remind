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
    headerLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
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
        marginTop: 0,
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    sidebarContent: {
        flex: 1,
        paddingTop: 0,
    },
    sidebarFooter: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        padding: 20,
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
        marginLeft: 12,
        color: '#ff6b6b',
        fontSize: 16,
        fontWeight: '600',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
    logoImage: {
        width: 32,
        height: 32,
        marginRight: 12,
        borderRadius: 8,
    },
    logoutButton: {
        backgroundColor: '#ffe5e5',
        padding: 10,
        borderRadius: 12,
    },
    activityContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    activityGrid: {
        marginTop: 15,
    },
    activityDay: {
        flex: 1,
        aspectRatio: 1,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    studiedDay: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    today: {
        borderColor: '#5b6af5',
        borderWidth: 2,
    },
    futureDay: {
        opacity: 0.5,
    },
    activityDayText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    studiedDayText: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    todayText: {
        color: '#5b6af5',
        fontWeight: '700',
    },
    checkIcon: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        color: '#4CAF50',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 10,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        fontWeight: '500',
    },
    motivationalContainer: {
        padding: 16,
        marginVertical: 12,
        backgroundColor: '#f0f4ff',
        borderRadius: 8,
        alignItems: 'center',
    },
    motivationalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5b6af5',
        textAlign: 'center',
    },
    // Calendar Styles
    calendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    calendarDay: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        borderRadius: 12,
    },
    calendarDayText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    // Streak Styles
    streakDay: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        transform: [{ scale: 1 }],
    },
    streakDayStart: {
        backgroundColor: '#4CAF50',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    streakDayEnd: {
        backgroundColor: '#4CAF50',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    streakDayText: {
        color: '#fff',
        fontWeight: '600',
    },
    streakConnector: {
        position: 'absolute',
        height: 4,
        backgroundColor: '#4CAF50',
        opacity: 0.6,
        top: '50%',
        transform: [{ translateY: -2 }],
    },
    // Hover effect for active days
    activeDayHover: {
        transform: [{ scale: 1.1 }],
    },
    // Gradient effect for streak days
    streakGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 12,
        opacity: 0.2,
    },
    // Stats container
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4CAF50',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    // Today's highlight
    todayCell: {
        borderWidth: 2,
        borderColor: '#5b6af5',
        backgroundColor: '#fff',
    },
    todayText: {
        color: '#5b6af5',
        fontWeight: '700',
    },
    // Inactive days
    inactiveDay: {
        opacity: 0.4,
    },
    // Month header
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    monthText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    weekDayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        width: 40,
        textAlign: 'center',
    },
}); 