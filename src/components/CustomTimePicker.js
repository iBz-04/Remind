import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomTimePicker = ({ selectedTime, onTimeSelect }) => {
    const currentHour = selectedTime.getHours();
    const currentMinute = selectedTime.getMinutes();
    const isPM = currentHour >= 12;
    const display12Hour = currentHour > 12 ? currentHour - 12 : (currentHour === 0 ? 12 : currentHour);

    const adjustTime = (type, value) => {
        const newDate = new Date(selectedTime);
        
        if (type === 'hour') {
            let newHour = value;
            if (isPM && value !== 12) newHour += 12;
            if (!isPM && value === 12) newHour = 0;
            newDate.setHours(newHour);
        } else if (type === 'minute') {
            newDate.setMinutes(value);
        } else if (type === 'period') {
            let newHour = currentHour;
            if (value === 'PM' && currentHour < 12) newHour += 12;
            if (value === 'AM' && currentHour >= 12) newHour -= 12;
            newDate.setHours(newHour);
        }
        
        onTimeSelect(newDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.timeDisplay}>
                <View style={styles.timeUnit}>
                    <TouchableOpacity 
                        style={styles.arrowButton}
                        onPress={() => {
                            const newHour = display12Hour === 12 ? 1 : display12Hour + 1;
                            adjustTime('hour', newHour);
                        }}
                    >
                        <Text style={styles.arrowText}>▲</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeText}>{display12Hour.toString().padStart(2, '0')}</Text>
                    <TouchableOpacity 
                        style={styles.arrowButton}
                        onPress={() => {
                            const newHour = display12Hour === 1 ? 12 : display12Hour - 1;
                            adjustTime('hour', newHour);
                        }}
                    >
                        <Text style={styles.arrowText}>▼</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.timeSeparator}>:</Text>

                <View style={styles.timeUnit}>
                    <TouchableOpacity 
                        style={styles.arrowButton}
                        onPress={() => {
                            const newMinute = (currentMinute + 5) % 60;
                            adjustTime('minute', newMinute);
                        }}
                    >
                        <Text style={styles.arrowText}>▲</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeText}>{currentMinute.toString().padStart(2, '0')}</Text>
                    <TouchableOpacity 
                        style={styles.arrowButton}
                        onPress={() => {
                            const newMinute = currentMinute === 0 ? 55 : currentMinute - 5;
                            adjustTime('minute', newMinute);
                        }}
                    >
                        <Text style={styles.arrowText}>▼</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.periodContainer}>
                    <TouchableOpacity 
                        style={[styles.periodButton, isPM ? null : styles.activePeriod]}
                        onPress={() => adjustTime('period', 'AM')}
                    >
                        <Text style={[styles.periodText, isPM ? null : styles.activePeriodText]}>AM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.periodButton, isPM ? styles.activePeriod : null]}
                        onPress={() => adjustTime('period', 'PM')}
                    >
                        <Text style={[styles.periodText, isPM ? styles.activePeriodText : null]}>PM</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },
    timeUnit: {
        alignItems: 'center',
        width: 45,
    },
    arrowButton: {
        padding: 8,
    },
    arrowText: {
        fontSize: 18,
        color: '#788eec',
    },
    timeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 3,
    },
    timeSeparator: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 8,
    },
    periodContainer: {
        marginLeft: 15,
    },
    periodButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginVertical: 3,
    },
    activePeriod: {
        backgroundColor: '#f0f3ff',
    },
    periodText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    activePeriodText: {
        color: '#788eec',
    },
});

export default CustomTimePicker; 