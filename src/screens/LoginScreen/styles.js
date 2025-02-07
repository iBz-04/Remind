import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
    },
    passwordIcon: {
        padding: 4,
    },
    button: {
        backgroundColor: '#5b6af5',
        borderRadius: 12,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#666',
    },
    footerLink: {
        fontSize: 16,
        color: '#5b6af5',
        fontWeight: '600',
    }
});
