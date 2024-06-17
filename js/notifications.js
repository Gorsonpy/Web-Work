// notifications.js

// 请求通知权限
export function requestNotificationPermission() {
    if (Notification.permission === 'default' || Notification.permission === 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        });
    } else {
        console.log(`Notification permission already ${Notification.permission}.`);
    }
}
